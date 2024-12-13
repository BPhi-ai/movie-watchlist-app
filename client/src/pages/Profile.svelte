<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import MovieCard from '../components/MovieCard.svelte';

    // props: id passed from route parameter
    let { id } = $props();

    // state to hold the fetched profile data
    let profile = $state(null);

    onMount(async () => {
        try {
            // get guest info from local storage
            const guest = JSON.parse(localStorage.getItem('guest'));

            // get profile with watchlist from the server with access token
            const response = await axios.get(`http://localhost:5174/guests/${id}`, {
                headers: {
                    Authorization: guest.header_token // attach token for authorization
                }
            });

            // assign profile to the response
            profile = response.data;
        } catch (error) {
            console.log(error);
        }
    });
</script>

<div class="profile-container">
    {#if !profile}
        <div>Loading Guest Profile...</div>
    {:else}
        <h1>Welcome, {profile.username}!</h1>
        <hr />
        <h2>Movie Watchlist</h2>
        <div class="movies-list">
            {#if profile.movie_watchlist.length === 0}
                <p>No movies in your watchlist.</p>
            {:else}
                {#each profile.movie_watchlist as watchlist}
                    <MovieCard
                        image={watchlist.movie.image}
                        title={watchlist.movie.title}
                        genres={watchlist.movie.genres}
                        status={watchlist.status}
                    />
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .profile-container {
        margin: 2rem auto;
        padding: 2rem;
        text-align: left;
    }

    h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
    }

    h2 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
    }

    .movies-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
</style>
