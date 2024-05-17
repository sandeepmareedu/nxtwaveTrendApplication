// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {each} = props
  const {title, price, rating, brand, imgUrl} = each
  return (
    <li className="similarProductListItem">
      <div className="similarProductItemCon">
        <img alt="similar product" className="similarProductImg" src={imgUrl} />
        <h1 className="similarProductHead">{title}</h1>
        <p>by {brand}</p>
        <div className="similarProductRatingCon">
          <h1 className="similarProductHead">Rs {price}/-</h1>
          <div className="ratingCon">
            <h5>{rating}</h5>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
