import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const status = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: status.initial,
    itemDetails: {},
    itemsCount: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: status.inprogress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        id: data.id,
        title: data.title,
        brand: data.brand,
        imgUrl: data.image_url,
        rating: data.rating,
        availability: data.availability,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          imgUrl: each.image_url,
          title: each.title,
          style: each.style,
          brand: each.brand,
          price: each.price,
          description: each.description,
          rating: each.rating,
          availability: each.availability,
          totalReviews: each.total_reviews,
        })),
        description: data.description,
        price: data.price,
      }

      this.setState({
        itemDetails: updatedData,
        apiStatus: status.success,
        similarProducts: updatedData.similarProducts,
      })
    } else {
      this.setState({
        apiStatus: status.failure,
      })
    }
  }

  onInc = () => {
    this.setState(prevState => ({
      itemsCount: prevState.itemsCount + 1,
    }))
  }

  onDec = () => {
    const {itemsCount} = this.state
    if (itemsCount > 1) {
      this.setState(prevState => ({
        itemsCount: prevState.itemsCount - 1,
      }))
    }
  }

  renderSuccessView = () => {
    const {itemDetails, itemsCount} = this.state
    const {
      title,
      brand,
      imgUrl,
      rating,
      availability,
      totalReviews,
      price,
      similarProducts,
      description,
    } = itemDetails

    return (
      <>
        <div className="mainProductDetails">
          <img alt="product" src={imgUrl} className="productItemDetailsImg" />
          <div className="productItemDetailsSubCon">
            <h1 className="productItemDetailsHead">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="productItemDetailsReviewsCon">
              <div className="ratingCon">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews}</p>
            </div>
            <p className="des">{description}</p>
            <p className="available">
              <span className="subHead">Available:</span>
              {availability}
            </p>
            <p className="available">
              <span className="subHead">Brand:</span>
              {brand}
            </p>
            <hr className="line" />
            <div className="itemsCount">
              <button
                aria-label="Decrease item count"
                data-testid="minus"
                onClick={this.onDec}
                className="incDec"
              >
                <BsDashSquare className="bsIcon" />
              </button>
              <p className="itemsNum">{itemsCount}</p>
              <button
                aria-label="Increase item count"
                data-testid="plus"
                onClick={this.onInc}
                className="incDec"
              >
                <BsPlusSquare className="bsIcon" />
              </button>
            </div>
            <button className="addToCart" type="button">
              Add to cart
            </button>
          </div>
        </div>
        <div className="similarProductsCon">
          <h1 className="similarProductsTitle">Similar Products</h1>
          <ul className="similarProductListCon">
            {similarProducts.map(each => (
              <SimilarProductItem each={each} key={each.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failureView"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.onContinue} type="button">
        {' '}
        Continue Shopping{' '}
      </button>
    </div>
  )

  renderProductItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case status.inprogress:
        return this.renderLoader()
      case status.success:
        return this.renderSuccessView()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="productItemDetailsCon">
          {this.renderProductItemDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
