import React from "react";
import FontAwesome from "react-fontawesome";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";
import ReactDOM from "react-dom";

import { sortableContainer, sortableElement } from "react-sortable-hoc";

import arrayMove from "array-move";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      onlyFavroites: false,
      numberPerPage: 100,
      tag: "",
      loadingOpacity: 0,
      reOrder: false,
      fetching: false,
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
  getImages = (tag, number = this.state.numberPerPage) => {
    if (!this.state.fetching) {
      this.setState({ fetching: true }, () => {
        const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${number}&format=json&safe_search=1&nojsoncallback=1`;
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
              this.setState({
                images: res.photos.photo,
                fetching: false,
                numberPerPage: number
              });
            }
          })
          .catch(() => this.setState({ fetching: false }));
      });
    }
  };

  componentDidMount() {
    this.setState({
      tag: this.props.tag
    });
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });

    this.checkScroll();
  }

  checkScroll = () =>
    setInterval(() => {
      if (typeof this.lastcomp !== "undefined" && !this.state.onlyFavroites) {
        const bounding = ReactDOM.findDOMNode(
          this.lastcomp
        ).getBoundingClientRect();

        if (bounding.top <= 1000)
          if (!this.state.fetching)
            this.getImages(this.props.tag, this.state.numberPerPage + 100);
      }
    }, 100);

  componentWillReceiveProps(props) {
    if (!this.state.images.length) this.getImages(props.tag);
    else if (props.tag !== this.state.tag) this.getImages(props.tag);
  }

  cloneImage = (imgToClone, locally) => {
    let newImages = this.state.images;
    newImages.unshift(imgToClone);

    this.setState({ images: newImages });
  };

  deleteImage = imgToDelete => {
    let newImages = this.state.images;
    newImages = newImages.filter(img => img.id !== imgToDelete.id);

    this.setState({ images: newImages });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (this.state.onlyFavroites) {
      this.setState(({ favorites }) => ({
        favorites: arrayMove(favorites, oldIndex, newIndex)
      }));
    } else {
      this.setState(({ images }) => ({
        images: arrayMove(images, oldIndex, newIndex)
      }));
    }
  };

  render() {
    const { onlyFavroites, fetching, reOrder } = this.state;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const SortableItem = sortableElement(({ key, dto }) => (
      <Image
        key={"image-" + dto.id + key}
        dto={dto}
        viewInLarge={() => this.props.viewImageLarge(dto)}
        duplicateImage={() => this.cloneImage(dto)}
        deleteImage={() => this.deleteImage(dto)}
        galleryWidth={this.state.galleryWidth}
      />
    ));

    const SortableList = sortableContainer(({ items }) => {
      return (
        <ul style={{ listStyle: "none" }}>
          {items.map((dto, key) => (
            <SortableItem
              ref={ref => key === items.length - 1 && (this.lastcomp = ref)}
              disabled={!reOrder}
              dto={dto}
              index={key}
              key={key}
            />
          ))}
        </ul>
      );
    });

    return (
      <div className="gallery-root">
        <div style={{ display: "flex", maxWidth: "50%", margin: "auto" }}>
          <button
            onClick={() =>
              this.setState({
                onlyFavroites: !onlyFavroites
              })
            }
            className="btnFavorite"
          >
            {onlyFavroites ? "Show all" : "Show Only Favorites"}
          </button>
          <button
            onClick={() =>
              this.setState({
                reOrder: !reOrder
              })
            }
            className="btnFavorite"
          >
            {!reOrder ? "Enable re-order" : "Disable re-order"}
          </button>
        </div>

        <div
          style={{
            position: "relative",
            width: "fit-content",
            margin: "0px auto"
          }}
        >
          <button
            onClick={() =>
              this.setState({
                reOrder: !reOrder
              })
            }
            className="btnFavorite"
          >
            Add your image
          </button>
          <input
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              right: 0,
              opacity: 0,
              zIndex: 3,
              cursor: "pointer",
              left: 0,
              top: 0,
              bottom: 0
            }}
            type="file"
            name="file"
            onChange={({ target }) => {
              // this.setState({ newImage: target.files[0] });
              this.cloneImage({
                title: target.files[0].name,
                src: target.files[0]
              });
            }}
          />
        </div>

        <div
          className="loading"
          style={{ visibility: fetching ? "visible" : "hidden" }}
        >
          <FontAwesome name="spinner" className="spinAll" />
        </div>
        {!onlyFavroites ? (
          <SortableList
            axis={"xy"}
            items={this.state.images}
            onSortEnd={this.onSortEnd}
          />
        ) : (
          <SortableList
            axis={"xy"}
            items={favorites}
            onSortEnd={this.onSortEnd}
          />
        )}
      </div>
    );
  }
}

export default Gallery;
