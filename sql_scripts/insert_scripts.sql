INSERT INTO USER (name, password) VALUE  (
	"MasterUser",
    "1234567"
);

INSERT INTO USER (name, password) VALUE (
	"Jealous User",
    "7654321"
);

INSERT INTO SONG (title, user_id, album_id, file_path, length_seconds, size) VALUE (
	"First Song",
    (SELECT id from USER where (USER.name = "MasterUser")),
    NULL,
    "/songs/571928308",
    "260",
    "200"
);

AFTER INSERT OF song_id, playlist_id ON SONG_PLAYLIST
FOR EACH ROW
BEGIN
	UPDATE PLAYLIST SET song_count