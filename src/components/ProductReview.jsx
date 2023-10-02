export default function ProductReview({ params }) {
  const { id } = params;

  function renderStars(rating) {
    const maxRating = 5;
    const filledStars = rating ? Math.round(rating) : 0;
    const emptyStars = rating ? maxRating - filledStars : maxRating;

    const starIcon = "★";
    const filledStarArray = Array(filledStars).fill(starIcon).join("");
    const emptyStarArray = Array(emptyStars).fill("☆").join("");

    return filledStarArray + emptyStarArray;
  }

  return <div>{id}</div>;
}
