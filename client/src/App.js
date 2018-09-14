import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      lat: null,
      long: null,
      response: '',
      value: ''
    };
  }

  // componentDidMount() {
  //   this.callApi()
  //     .then(res => this.setState({ response: res.express }))
  //     .catch(err => console.log(err));
  // }

  getLatLong = () => {

  }

  callApi = async () => {
    const response = await fetch('/api/backend');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  callNasaApi = async (lat, long) => {

    const api_key = '7ZLmyLopCrbUeU1A6wxctoeX1MxbNmrHFOj9MiRj';

    const response = await fetch(`https://api.nasa.gov/planetary/earth/imagery?lon=${long}&lat=${lat}&date=2014-02-01&cloud_score=True&api_key=${api_key}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }
  
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { value } = this.state;
    let lat = null;
    let long = null;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === ',') {
        lat = parseFloat(value.slice(0, i));
        long = parseFloat(value.slice(i + 1, value.length));
      }
    }

    this.callNasaApi(lat, long)
      .then(res => this.setState({ image: res.url }))
      .catch(err => console.log(err));
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mapping App</h1>

        </header>
        <p className="App-intro">
          Enter latitude and longitude coordinates and click submit to view image 
        </p>
        <form onSubmit={this.handleSubmit}>
          <input className="" type="text" value={this.state.value} onChange={this.handleChange}/>
          <input type="submit" value="Submit coordinates"/>
        </form>
        <div className="App-image">
          <i className="fa fa-map-marker" />
          <img src={this.state.image} />
        </div>
      </div>
    );
  }
}

export default App;
