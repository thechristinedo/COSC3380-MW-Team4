INSERT INTO USER (name, password) VALUE  (
	"MasterUser",
    "1234567"
);

INSERT INTO USER (name, password) VALUE (
	"Jealous User",
    "7654321"
);

INSERT INTO USER (name, password) VALUE (
	"Loving User",
    "Hello, world!"
);

INSERT INTO SONG (title, user_id, album_id, file_path, length_seconds, size) VALUE (
	"First Song",
    (SELECT id from USER where (USER.name = "MasterUser")),
    NULL,
    "/songs/571928308",
    "260",
    "200"
);

INSERT INTO PLAYLIST (title, user_id) VALUE (
	"First Playlist",
    (SELECT id FROM USER WHERE (USER.name = "MasterUser"))
);

INSERT INTO SONG_PLAYLIST (playlist_id, song_id) VALUE(
	1,
    (SELECT id FROM SONG WHERE (SONG.title = "First Song" AND SONG.user_id = 1))
);

CREATE TRIGGER UPDATE_PLAYLIST_SONG_COUNT
AFTER INSERT ON SONG_PLAYLIST
FOR EACH ROW
	UPDATE PLAYLIST SET song_count = song_count + 1
    WHERE PLAYLIST.id = NEW.playlist_id;
    
CREATE TRIGGER UPDATE_SONG_RATING
AFTER INSERT ON RATING
FOR EACH ROW
	UPDATE SONG SET SONG.rating = (
		(SELECT SUM(RATING.rating)
		FROM RATING
		WHERE RATING.song_id = SONG.id)
        / 
        (SELECT COUNT(
        IF(RATING.song_id = SONG.id, 1, NULL))
        FROM RATING))
	WHERE SONG.id = NEW.song_id;
    
INSERT INTO RATING (user_id, song_id, rating) VALUE (
	3, 1, 5
);