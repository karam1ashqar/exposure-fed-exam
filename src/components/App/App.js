import React from "react";
import "./App.scss";
import Gallery from "../Gallery";
import FontAwesome from "react-fontawesome";

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.state = {
      tag: "sea",
      imgData: {},
      imgView: false
    };
  }

  viewImageInLarge = imgData => {
    this.setState({ imgData, imgView: true });
  };

  render() {
    const { imgData } = this.state;
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input
            className="app-input"
            onChange={event => this.setState({ tag: event.target.value })}
            value={this.state.tag}
          />
        </div>

        <Gallery
          viewImageLarge={dto => this.viewImageInLarge(dto)}
          tag={this.state.tag}
        />
        {this.state.imgView && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,

              bottom: 0,
              color: "white",
              zIndex: 100,
              background: "rgba(0,0,0,0.60)"
            }}
          >
            <h1>{imgData.title}</h1>
            <div
              style={{ width: 500, marginLeft: "auto", marginRight: "auto" }}
            >
              <FontAwesome
                style={{
                  display: "block",
                  cursor: "pointer",
                  fontSize: 25,
                  marginBottom: 5,
                  marginLeft: "auto",
                  width: "fit-content"
                }}
                onClick={() => this.setState({ imgView: false })}
                name="times-circle"
              />
              <img
                style={{ width: 500, objectFit: "cover" }}
                src={`https://farm${imgData.farm}.staticflickr.com/${imgData.server}/${imgData.id}_${imgData.secret}.jpg`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
