const body = document.querySelector('body');

async function get_songs(data) {
    const response = await fetch('/requests/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

// data = {UserID, SongID, Rating, WasRated} (see where this is called)
async function rate_song(data) {
    let response = await fetch('/requests/rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

// Need code to handle if no cookie stored for user
dc = document.cookie;
const start_idx = dc.indexOf('UserID')
const end_idx = dc.substr(start_idx).indexOf(';');
let user_id;
if (end_idx === -1) {
    user_id = parseInt(dc.substr(start_idx+7));
}
else {
    user_id = parseInt(dc.substr(start_idx+7, end_idx));
}

function get_rating_options() {
    const select = document.createElement('select');
    for (let counter = 1; counter <= 5; counter++) {
        const option = document.createElement('option');
        option.text = counter.toString();    
        option.value = counter;
        select.add(option);
    }
    return select;
}

function get_rating_button() {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    return button;
}

// results = {Songs: [], Ratings: []}
get_songs({UserID: user_id}).then(results => {
    const song_list = document.getElementById('song_list');
    // song_info: {id, title, rating}
    for (const song_info of results.Songs) {
        const li = document.createElement('li');
        const unique_id = song_info.id.toString();
        li.setAttribute('id', unique_id);

        const select = get_rating_options();
        const button = get_rating_button();

        let wasRated = false;
        // rating info: {song_id,  rating}
        for (const rating_info of results.Ratings) {
            if (rating_info.song_id === song_info.id) {
                select.childNodes[rating_info.rating-1].selected = true;
                wasRated = true;
            }
        }
        const body = `Title: ${song_info.title}, Rating: ${song_info.rating}\t`
        li.innerHTML = body;
        li.appendChild(select);
        button.addEventListener('click', () => {
            const rating = select.value;
            rate_song({UserID: user_id, SongID: song_info.id, Rating: rating, WasRated: wasRated})
            .then( (response) => {
                // response = {Modified, NewRating}
                if (response.Modified) {
                    wasRated = true;
                    const newBody = `Title: ${song_info.title}, Rating: ${response.NewRating}\t`
                    const element = document.querySelector('li[id=\'' + unique_id + '\']');
                    element.innerHTML = newBody;
                    element.appendChild(select);
                    element.appendChild(button);
                }
            });
        });
        li.appendChild(button);
        song_list.appendChild(li);
    }
});
