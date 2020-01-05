import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth()
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = "https://api.flickr.com/";
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: "GET"
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({ images: res.photos.photo });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    if (!this.state.images.length) this.getImages(props.tag);
  }

  cloneImage = imgToClone => {
    let newImages = this.state.images;

    newImages.unshift(imgToClone);

    this.setState({ images: newImages });
  };

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, key) => {
          return (
            <Image
              key={"image-" + dto.id + key}
              dto={dto}
              viewInLarge={() => this.props.viewImageLarge(dto)}
              duplicateImage={() => this.cloneImage(dto)}
              galleryWidth={this.state.galleryWidth}
            />
          );
        })}
      </div>
    );
  }
}

export default Gallery;
