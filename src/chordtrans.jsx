export default class ChordTransposer extends Object {

  static doTransposition(aChord, aTransposition, aForce_b) {
    let mBaseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'H', 'B'];
    let mResult = '';
    let mChord = '';
    let i = 0;
    while (i < aChord.length) {
      if (mBaseNotes.indexOf(aChord[i]) < 0) {
        mResult = mResult + aChord[i];
      } else {
        mChord = aChord[i];
        if (i + 1 <= aChord.length) {
          if (['#', 'b'].indexOf(aChord[i + 1]) >= 0) {
            mChord = mChord + aChord[i + 1];
            i++;
          }
        }
        mResult = mResult + this.TransposeBaseChord(mChord, aTransposition, aForce_b);
      }
      i++;
    }
    return(mResult);
  }


  static TransposeBaseChord(AChord, aTransposition, aForce_b) {
    let mTransTable1 = ['C','C#','D','D#','E','F','F#','G','G#','A','B','H'];
    let mTransTable2 = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','B','H'];
    let mTable = 1;
    let mIndex = 999;
    for (let i = 0; i < mTransTable1.length; i++) {
      if (mTransTable1[i] === AChord) {
        mTable = 1;
        if (aForce_b) mTable = 2;
        mIndex = i;
        break;
      }
      if (mTransTable2[i] === AChord) {
        mTable = 2;
        mIndex = i;
        break;
      }
    }
    if (mIndex != 999) {
      mIndex += aTransposition;
      if (mIndex < 0)
        mIndex += mTransTable1.length;
      if (mIndex >= mTransTable1.length)
        mIndex -= mTransTable1.length;
      if (mTable === 1)
        return mTransTable1[mIndex];
      if (mTable === 2)
        return mTransTable2[mIndex];
    }
  }

}

