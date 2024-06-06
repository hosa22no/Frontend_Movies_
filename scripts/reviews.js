const API_URL = 'https://localhost:44352';
const REVIEWS_URL = `${API_URL}/api/Review`;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('add-title').value;
        const rating = document.getElementById('add-rating').value;
        const comment = document.getElementById('add-comment').value;
        const movieId = document.getElementById('add-movie-id').value;
        await addReview({ title, rating, comment, movieId });
    });

    document.getElementById('update-review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const reviewId = document.getElementById('update-review-id').value;
        const rating = document.getElementById('update-review-rating').value;
        const comment = document.getElementById('update-review-comment').value;
        const movieId = document.getElementById('update-movie-id').value;
        const movieTitle = document.getElementById('update-movie-title').value;
        await updateReview(reviewId, { rating, comment, movieId, movieTitle });
    });
    

   /* document.getElementById('update-review-button').addEventListener('click', async () => {
        const title = document.getElementById('add-title').value;
        const rating = document.getElementById('add-rating').value;
        const comment = document.getElementById('add-comment').value;
        const movieId = document.getElementById('add-movie-id').value;
        const reviewId = prompt("Enter the ID of the review you want to update:");
        await updateReview(reviewId, { title, rating, comment, movieId });
    });*/

    document.getElementById('delete-review-button').addEventListener('click', async () => {
        const reviewId = prompt("Enter the ID of the review you want to delete:");
        await deleteReview(reviewId);
    });

    getMyReviews();
    getAllReviews();
});

document.getElementById('get-review-button').addEventListener('click', async () => {
    const reviewId = document.getElementById('review-id-input').value;
    if (reviewId) {
        await getReviewById(reviewId);
    } else {
        alert('Please enter a review ID.');
    }
});


async function addReview(review) {
    const token = localStorage.getItem('token');
    const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(review)
    });
    const result = await response.json();
    console.log(result);
    if (response.ok) {
        alert('Review added successfully.');
        getMyReviews(); // Refresh my reviews after adding a new review
    } else {
        alert('Failed to add review.');
    }
}
async function updateReview(reviewId, reviewData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${REVIEWS_URL}/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (response.ok) {
        alert('Review updated successfully.');
        getMyReviews(); // Refresh my reviews after update
    } else {
        alert('Failed to update review.');
    }
}

/*
async function updateReview(reviewId, reviewData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${REVIEWS_URL}/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (response.ok) {
        alert('Review updated successfully.');
        getMyReviews(); // Refresh my reviews after update
    } else {
        alert('Failed to update review.');
    }
}
*/
async function deleteReview(reviewId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${REVIEWS_URL}/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        alert('Review deleted successfully.');
        getMyReviews(); // Refresh my reviews after deletion
    } else {
        alert('Failed to delete review.');
    }
}


async function getMyReviews() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${REVIEWS_URL}/myreviews`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const reviews = await response.json();
    console.log(reviews);
    displayMyReviews(reviews);
}

async function getAllReviews() {
    const response = await fetch(REVIEWS_URL);
    const reviews = await response.json();
    console.log(reviews);

    displayAllReviews(reviews);
}



/*function displayReviews(reviews) {
    const outputElement = document.getElementById('reviews-output');
    outputElement.innerHTML = '';

    if (reviews.length === 0) {
        outputElement.textContent = 'No reviews found.';
        return;
    }

    const ul = document.createElement('ul');
    reviews.forEach(review => {
        const li = document.createElement('li');
        li.textContent = `Review ID: ${review.reviewId}, Movie Title: ${review.movieTitle}, Rating: ${review.rating}, Comment: ${review.comment}`;
        ul.appendChild(li);
    });
    outputElement.appendChild(ul);
}
*/
function displayMyReviews(reviews) {
    const listElement = document.getElementById('my-reviews-list');
    listElement.innerHTML = '';

    if (reviews.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'You have not written any reviews yet.';
        listElement.appendChild(li);
        return;
    }

    reviews.forEach(review => {
        const li = document.createElement('li');
        li.textContent = `Movie Title: ${review.movieTitle}, Rating: ${review.rating}, Comment: ${review.comment}, Movie ID: ${review.movieId}`;
        listElement.appendChild(li);
    });
}

function displayAllReviews(reviews) {
    const outputElement = document.getElementById('all-reviews-list');
    outputElement.innerHTML = '';

    if (reviews.length === 0) {
        outputElement.textContent = 'No reviews found.';
        return;
    }

    const ul = document.createElement('ul');
    reviews.forEach(review => {
        const li = document.createElement('li');
        li.textContent = `Review ID: ${review.id}, Rating: ${review.rating}, Comment: ${review.comment}, Movie ID: ${review.movieId}`;
        ul.appendChild(li);
    });
    outputElement.appendChild(ul);
}

async function getReviewById(reviewId) {
    try {
        const response = await fetch(`${REVIEWS_URL}/${reviewId}`);
        if (response.ok) {
            const review = await response.json();
            displayReviewDetails(review);
        } else {
            alert('Review not found.');
        }
    } catch (error) {
        console.error('Error fetching review:', error);
        alert('Failed to fetch review.');
    }
}

function displayReviewDetails(review) {
    const outputElement = document.getElementById('review-details-list');
    outputElement.innerHTML = '';

    if (!review) {
        outputElement.textContent = 'No review details found.';
        return;
    }

    const li = document.createElement('li');
    li.textContent = `Review ID: ${review.id}, Rating: ${review.rating}, Comment: ${review.comment}, Movie ID: ${review.movieId}`;
    outputElement.appendChild(li);
}