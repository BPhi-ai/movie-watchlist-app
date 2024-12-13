<script>
    // 'export' is used to make these variables accessible as props
    export let image = '';
    export let title = '';
    export let genres = [];
    export let status = '';
</script>

<div class="movie-card">
    <img class="movie-image" src={image} alt={title} />
    <div class="movie-info">
        <p class="movie-title">{title}</p>
        <p class="movie-genres">{genres}</p>
        <p class="movie-status">{status}</p>
    </div>
</div>

<style>
    .movie-card {
        background-color: #1d2531;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        max-width: 250px;
        transition: transform 0.2s ease-in-out;
    }

    .movie-card:hover {
        transform: scale(1.05);
    }

    .movie-image {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .movie-info {
        text-align: center;
    }

    .movie-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    .movie-genres {
        color: #a8b9b7;
        margin: 0.3rem 0;
    }

    .movie-status {
        font-weight: bold;
        margin-top: 0.3rem;
    }
</style>
