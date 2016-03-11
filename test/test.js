// start the test with: npm test -- --v
import should from 'should';


import Cht from './../src/chordtrans.jsx';
describe('Chord transposer test:', () => {
  it('Basic chord transposition working', () => {
    Cht.TransposeBaseChord('C', 3, false).should.be.exactly('D#');
    Cht.TransposeBaseChord('G#', -2, false).should.be.exactly('F#');
    Cht.TransposeBaseChord('C', 3, true).should.be.exactly('Eb');
    Cht.TransposeBaseChord('G#', -2, true).should.be.exactly('Gb');
  });
  it('Full chord transposition working', () => {
    Cht.doTransposition('C F G7', 3, false).should.be.exactly('D# G# B7');
    Cht.doTransposition('C F G7', 3, true).should.be.exactly('Eb Ab B7');
    Cht.doTransposition('G#mi 4/7', 2, false).should.be.exactly('Bmi 4/7');
    Cht.doTransposition('Cmi7', -5, false).should.be.exactly('Gmi7');
  });
});

import {SongData} from './../src/songbook.jsx';
describe('Songdata object test:', () => {
  let mSongData;
  it('<ID> parse test', () => {
    mSongData = new SongData('@ID\n12345\n');
    mSongData.should.be.instanceof(SongData);
    mSongData.should.have.property('id');
    mSongData.id.should.be.exactly('12345');
  });
  it('<Song name> parse test', () => {
    mSongData = new SongData('@N\nThis is a song name\n');
    mSongData.should.be.instanceof(SongData);
    mSongData.should.have.property('songName');
    mSongData.songName.should.be.exactly('This is a song name');
  });
  it('<Song author> parse test', () => {
    mSongData = new SongData('@A\nAuthor\n');
    mSongData.should.be.instanceof(SongData);
    mSongData.should.have.property('author');
    mSongData.author.should.be.exactly('Author');
  });
  it('<Song text / first verse> parse test', () => {
    mSongData = new SongData('@S1\nLine of {Ami} text\n');
    mSongData.should.be.instanceof(SongData);
    mSongData.should.have.property('data');
    mSongData.data[0].type.should.be.exactly(5);
    mSongData.data[0].prefix.should.be.exactly('1.');
    mSongData.data[0].data.should.be.exactly('Line of {Ami} text');
  });
  it('<Song text / 2nd refrain> parse test', () => {
    mSongData = new SongData('@R2\nRefrain\n');
    mSongData.should.be.instanceof(SongData);
    mSongData.should.have.property('data');
    mSongData.data[0].type.should.be.exactly(6);
    mSongData.data[0].prefix.should.be.exactly('Ref2:');
    mSongData.data[0].data.should.be.exactly('Refrain');
  });
});

import {SongLine, MultiplyUnits} from './../src/songbook.jsx';
describe('Songline segment separation function test:', () => {
  let mSegments;
  it('Simple Chord and Text separation', () => {
    mSegments = SongLine.separateSegments('Line of {Ami} text');
    mSegments.should.be.array;
    mSegments.length.should.be.exactly(2);
    mSegments[0].should.be.object;
    mSegments[0].chord.should.be.exactly('\xA0');
    mSegments[0].text.should.be.exactly('Line\xA0of\xA0');
    mSegments[1].should.be.object;
    mSegments[1].chord.should.be.exactly('Ami\xA0');
    mSegments[1].text.should.be.exactly('\xA0text');
 });
  it('Units multiplication', () => {
    MultiplyUnits('8px',3).should.be.exactly('24px');
    MultiplyUnits('2vw',4).should.be.exactly('8vw');
  });
});
