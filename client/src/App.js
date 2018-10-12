import React, { Component } from 'react';
import './App.css';
import { NASA_API_KEY } from './creds';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageReceived: false,
      lat: null,
      long: null,
      response: '',
      value: ''
    };
  }

  callApi = async () => {
    const response = await fetch('/api/backend');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  callNasaApi = async (lat, long) => {
    const api_key = NASA_API_KEY;

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
      .then(res => this.setState({ 
        image: res.url,
        imageReceived: true
      }))
      .catch(err => console.log(err));
  }

  render() {
    const image = this.state.imageReceived ? 
    (
      <div className="App-image-container">
        <div className="image">
          <img src={this.state.image} />
        </div>
        <div className="App-image">
          <div className="hl">
            <div className="vl"></div>
            <div className="vl"></div>
            <div className="vl"></div>
          </div>
          <div className="hl">
            <div className="vl"></div>
            <div className="vl"></div>
            <div className="vl"></div>
          </div>
          <div className="hl">
            <div className="vl"></div>
            <div className="vl"></div>
            <div className="vl"></div>
          </div>
        </div>
        <i className="fa fa-map-marker" />
      </div>
    ) : null;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mapping App</h1>
        </header>
        <h3 className="App-intro">
          Enter latitude and longitude coordinates and click submit to view image 
        </h3>
        <p>Enter coordinates in the correct format with a comma to separate them.</p>
        <form onSubmit={this.handleSubmit}>
          <input className="" type="text" value={this.state.value} onChange={this.handleChange} placeholder="latitude, longitude" />
          <input type="submit" value="Submit coordinates"/>
        </form>
        {image}
      </div>
    );
  }
}

export default App;
