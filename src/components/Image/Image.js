import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      flippedImage: false,
      size: 200,
      hearted: false,
      status: "Added to",
      txtOpacity: 0,
      timeoutTxt: setTimeout(() => {})
    };
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size
    });
  }

  hideTextStatus = () => {
    clearTimeout(this.state.timeoutTxt);
    this.setState({
      timeoutTxt: setTimeout(() => {
        this.setState({ txtOpacity: 0 });
      }, 3000)
    });
  };
  toggleFavorite = () => {
    const { dto } = this.props;
    const { hearted } = this.state;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!hearted) {
      favorites.push(dto);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      this.setState(
        { hearted: true, txtOpacity: 1, status: "Added to" },
        this.hideTextStatus
      );
    } else {
      let newFavorites = favorites.filter(dt => dt.id !== dto.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      this.setState(
        { hearted: false, txtOpacity: 1, status: "Removed from" },
        this.hideTextStatus
      );
    }
  };

  checkIfHearted = () => {
    const { dto } = this.props;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let exists = favorites.filter(dt => dt.id === dto.id);
    if (exists.length) this.setState({ hearted: true });
  };

  componentDidMount() {
    this.calcImageSize();
    this.checkIfHearted();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  flipImage = () => {
    this.setState({
      flippedImage: !this.state.flippedImage
    });
  };

  render() {
    const { hearted, flippedImage, size, status, txtOpacity } = this.state;
    return (
      <div
        className="image-root"
        style={{
          zIndex: 100,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: size + "px",
          height: size + "px",
          direction: flippedImage ? "ltr" : "rtl",
          transform: flippedImage ? "scaleX(-1)" : "scaleX(1)"
        }}
      >
        <div
          className="imageActions"
          style={{
            display: "flex",
            flexDirection: "row-reverse"
          }}
        >
          <FontAwesome
            onClick={this.flipImage}
            className="image-icon"
            name="arrows-alt-h"
            title="flip"
          />
          <FontAwesome
            onClick={this.props.duplicateImage}
            style={{
              transform: flippedImage ? "scaleX(-1)" : "scaleX(1)"
            }}
            className="image-icon"
            name="clone"
            title="clone"
          />
          <FontAwesome
            onClick={this.props.viewInLarge}
            className="image-icon"
            name="expand"
            title="expand"
          />
        </div>
        <div
          style={{
            right: flippedImage ? 0 : "unset",
            left: !flippedImage ? 0 : "unset",
            direction: flippedImage ? "ltr" : "rtl"
          }}
          className="heartContainer"
        >
          <p
            style={{
              fontSize: 11,
              transition: "opacity 0.4s ease",
              transform: flippedImage ? "scaleX(-1)" : "scaleX(1)",
              opacity: txtOpacity
            }}
          >
            {status} favorites
          </p>
          <FontAwesome
            onClick={this.toggleFavorite}
            className={hearted ? "heart-icon red" : "heart-icon"}
            name="heart"
            title="heart"
          />
        </div>
      </div>
    );
  }
}

export default Image;
