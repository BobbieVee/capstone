import React, {Component} from 'react';
import { connect } from 'react-redux';
import {  } from '../store';
import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import {daysInMonth} from '../../utils';

class NewMeetup extends Component {
    constructor(props){
        super();
        const { user } = props;
        let now = new Date(),
            now_year = now.getFullYear(),
            now_month = now.getMonth() + 1;


        this.state = {
          avail_years: [2017, 2018],
          avail_months: _.range(1, 13),
          avail_dates: _.range(1, daysInMonth(now_year, now_month) + 1),
          avail_hours: _.range(24),
          input_year:  -1,
          input_month: -1,
          input_date: -1,
          input_hour: -1,
          input_friend: -1,
          input_err: '',
          input_success: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
      event.preventDefault();
      const {input_year, input_month, input_date, input_hour, input_friend} = this.state;
      const {user} = this.props;
      // console.log(this.state);
      axios.post(`/api/meetup/add/${user.id}`, {
        year: input_year * 1,
        month: input_month * 1,
        date: input_date * 1,
        hour: input_hour * 1,
        friendId: input_friend * 1
      })
      .then(() => {
        setTimeout(() => this.setState({input_success: ''}), 2000);
        this.setState({
          input_year: -1,
          input_month: -1,
          input_date: -1,
          input_hour: -1,
          input_friend: -1,
          input_err: '',
          input_success: 'Meetup Added!'
        })
      })
      .catch(err => {
        console.log("error: ", err);
        if(err.response) this.setState({input_err: err.response.data, input_success:''});
        else this.setState({input_err: 'Request Failed!', input_success: ''});
      })
    }

    handleChange(event) {
      const {input_year, input_month} = this.state,
          value = event.target.value,
          name = event.target.name;

      if(name === 'input_year') {
        this.setState({
          [name]: value,
          avail_dates: _.range(1, daysInMonth(value, input_month) + 1),
        });
      }
      else if(name === 'input_month') {
        this.setState({
          [name]: value,
          avail_dates: _.range(1, daysInMonth(input_year, value) + 1),
        });
      }
      else {
        this.setState({ [name]: value });
      }
    }

    render(){
        const {user} = this.props;
        if(! user.id) return <Redirect to='/Login' />

        const {
          now_year, now_month, now_date, now_hour,
          avail_years, avail_months, avail_dates, avail_hours,
          input_year, input_month, input_date, input_hour, input_friend, input_err, input_success
        } = this.state;

        return (
          <div>
            {
                input_err && (<div className="alert alert-danger" role="alert">
                                {input_err}
                              </div>)
            }
            {
                input_success && (<div className="alert alert-success" role="alert">
                                {input_success}
                              </div>)
            }
            <form onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-1">
                    <label>Year</label>
                    <select name='input_year' value={input_year} className="form-control" onChange={this.handleChange}>
                      <option value='-1'>Choose</option>
                      {
                        avail_years.map(year => <option key={year} value={year}>{year}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Month</label>
                    <select name='input_month' value={input_month} className="form-control" onChange={this.handleChange}>
                      <option value='-1'>Choose</option>
                      {
                        avail_months.map(month => <option key={month} value={month}>{month}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Date</label>
                    <select name='input_date' value={input_date} className="form-control" onChange={this.handleChange}>
                      <option value='-1'>Choose</option>
                      {
                        avail_dates.map(date => <option key={date} value={date}>{date}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Hour</label>
                    <select name='input_hour' value={input_hour} className="form-control" onChange={this.handleChange}>
                      <option value='-1'>Choose</option>
                      {
                        avail_hours.map(hour => <option key={hour} value={hour}>{hour}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Friend</label>
                    <select name='input_friend' value={input_friend} className="form-control" onChange={this.handleChange}>
                      <option value='-1'>Choose a friend</option>
                      {
                        user.friends.map(friend => <option key={friend.id} value={friend.id}>{friend.name}</option>)
                      }
                    </select>
                  </div>
                </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        )
    }
}


//////////////////////////////////////////////////////

const mapState = (state) => {
  return {
    user: state.user
  }
}
const mapDispatch = (dispatch) => {
  return {
  };
};

// export default connect(mapState, mapDispatch)(Login);
export default connect(mapState, mapDispatch)(NewMeetup);