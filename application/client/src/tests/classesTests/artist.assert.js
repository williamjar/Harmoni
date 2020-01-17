import {Artist} from "../../classes/artist";

test('Artist constructor genre', () => {
    expect(Artist.getTestArtists()[0].genre).toBe('Folk');
});

test('Artist has document', () => {
    expect(Artist.getTestArtists()[0].documents[0]).not.toBe(null);
});

test('Artist doesn\'t have document', () => {
    expect(Artist.getTestArtists()[1].documents).toStrictEqual([]);
});

