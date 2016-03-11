import React from 'react';
import ReactDOM from 'react-dom';
import cptable from 'codepage';
import ChordTransposer from './chordtrans.jsx';
var shortid = require('shortid');

// All song element meta types declaration
var ElementType = {
  dttUnknown: 0, dttSongName: 1, dttSongAuthor: 2, dttNote: 3, dttNoteRight: 4, dttStroke: 5, dttRefrain: 6,
  dttRecitative: 7, dttSolo: 8, dttRegister: 9, dttID: 10
};

/**
 * -----------------------------------------------------------------------------------
 * Song row data holder object
 * Put raw song data to constructor and get it segmented in following properties:
 * SongData.id
 * SongData.songName
 * SongData.author
 * SongData.data[object]  // object = {type: ElementType, SongLine: string}
 */
export class SongData {
  constructor(aRowSongData) {
    this.rowData = aRowSongData;
    let mPos = -1;
    let mLine = '';
    this.data = [];
    let mSongText = aRowSongData;
    // interpret metadata from the raw data
    let mDataType = ElementType.dttUnknown;
    let mOrder = 0;
    let mIndex = 0;
    //
    while (mSongText.trim().length > 0) {
      mPos = mSongText.indexOf('\n');
      if (mPos >= 0) {
        mLine = mSongText.substr(0, mPos).trim();
        mSongText = mSongText.substr(mPos+1, mSongText.length);
      } else {
        mLine = mSongText.trim();
        mSongText = '';
      }
      if (mLine === '@ID') {
        mDataType = ElementType.dttID;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@N') {
        mDataType = ElementType.dttSongName;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@A') {
        mDataType = ElementType.dttSongAuthor;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@PP') {
        mDataType = ElementType.dttNoteRight;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@P') {
        mDataType = ElementType.dttNote;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@SL') {
        mDataType = ElementType.dttSolo;
        mIndex = 0;
        continue;
      } else
      if (mLine.substr(0,2) === '@S') {
        mDataType = ElementType.dttStroke;
        if (mLine.slice(2, mLine.length) !== '') {
          try {
            mOrder = parseInt(mLine.slice(2, mLine.length));
          } catch(e) {
            console.log('Wrong strophe parameter in: ' + mLine);
          }
        } else {
          mOrder = 0;
        }
        mIndex = 0;
        continue;
      } else
      if (mLine.substr(0,2) === '@R') {
        mDataType = ElementType.dttRefrain;
        if (mLine.slice(2, mLine.length) !== '') {
          try {
            mOrder = parseInt(mLine.slice(2, mLine.length));
          } catch(e) {
            console.log('Wrong refrain parameter in: ' + mLine);
          }
        } else {
          mOrder = 0;
        }
        mIndex = 0;
        continue;
      } else
      if (mLine === '@C') {
        mDataType = ElementType.dttRecitative;
        mIndex = 0;
        continue;
      } else
      if (mLine === '@W') {
        mDataType = ElementType.dttRegister;
        mIndex = 0;
        continue;
      } else
      if (mLine.substr(0,2) === '@F') {

      } else
      if (mLine === '@MOV') {

        continue;
      }
      // zadny ridici znak - tedy obsahuje data
      // do code page conversion
      mLine = cptable.utils.decode(1250, mLine, 'str');
      switch (mDataType) {
        case ElementType.dttUnknown:
          // ignore for now
          break;
        case ElementType.dttID:
          this.id = mLine;
          mDataType = ElementType.dttUnknown;
          break;
        case ElementType.dttSongName:
          this.songName = mLine;
          mDataType = ElementType.dttUnknown;
          break;
        case ElementType.dttSongAuthor:
          this.author = mLine;
          mDataType = ElementType.dttUnknown;
          break;
        case ElementType.dttNote:
          this.data.push({type: ElementType.dttNote, prefix: '', data: mLine, index: mIndex});
          break;
        case ElementType.dttNoteRight:
          this.data.push({type: ElementType.dttNoteRight, prefix: '', data: mLine, index: mIndex});
          break;
        case ElementType.dttStroke:
          if (mIndex === 0)
            this.data.push({type: ElementType.dttStroke, prefix: ((mOrder>0) ? mOrder+'.' : ''), data: mLine, index: mIndex});
          else
            this.data.push({type: ElementType.dttStroke, prefix: '', data: mLine, index: mIndex});
          mIndex++;
          break;
        case ElementType.dttRefrain:
          if (mIndex === 0)
            this.data.push({type: ElementType.dttRefrain, prefix: 'Ref' + ((mOrder>0) ? mOrder : '') + ':', data: mLine, index: mIndex});
          else
            this.data.push({type: ElementType.dttRefrain, prefix: '', data: mLine, index: mIndex});
          mIndex++;
          break;
        case ElementType.dttRecitative:
        // not implemented
          break;
        case ElementType.dttSolo:
          this.data.push({type: ElementType.dttSolo, prefix: ((mIndex==0) ? 'Solo:' : ''), data: mLine, index: mIndex});
          mIndex++;
          break;
        case ElementType.dttRegister:
          this.data.push({type: ElementType.dttRegister, prefix: '', data: mLine, index: mIndex});
          mIndex++;
          break;
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------------------
 * Komponenta obsahuje button pro vyber souboru, ovladaci tlacitka pro transpozici a font
 * + vykreslovaci komponentu cele pisnicky
 */
export default class SongPage extends React.Component {

  constructor() {
    super();
    this.state = {sSongData: new SongData(''),
                  sTransposition: 0,
                  sForce_b: false,
                  sFontSize: 0};
  }

  render() {
    return (
      <div style={{padding: '7px 0px'}}>
        <input type="file" id="fileSelector" onChange={this.onSongFileSelected.bind(this)}/>

        <div style={{position:'relative', left:'20px'}}>
          <span>
            <button id="transMinus" className="TransButton" onClick={this.onChangeTransposition.bind(this)}> Trans - </button>
              <span style={{position:'relative', top:'2px'}}>
                {'\xA0' + this.state.sTransposition + '\xA0'}
              </span>
            <button id="transPlus"  className="TransButton" onClick={this.onChangeTransposition.bind(this)}> Trans + </button>
          </span>

          <span style={{position:'relative', left:'7px', top:'4px'}}>
            <input type="checkbox" onChange={this.onForceBChange.bind(this)}/>-b
          </span>

          <span style={{position:'relative', left:'40px'}}>
            <button id="fontMinus" className="TransButton" onClick={this.onChangeFontSize.bind(this)}> Font - </button>
              <span style={{position:'relative', top:'2px'}}>
              {'\xA0' + this.state.sFontSize + '\xA0'}
              </span>
            <button id="fontPlus"  className="TransButton" onClick={this.onChangeFontSize.bind(this)}> Font + </button>
          </span>
        </div>

        <SongDisplayer content={this.state.sSongData} trans={this.state.sTransposition}
                       forceB={this.state.sForce_b} fontSize={this.state.sFontSize}>
        </SongDisplayer>
      </div>
    );
  };

  onSongFileSelected(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = (e) => {
      var contents = e.target.result;
      this.setState({sSongData: new SongData(contents)});
    };
    reader.readAsBinaryString(file);
    this.forceUpdate();
  }

  onChangeTransposition(e) {
    this.setState({sTransposition: this.state.sTransposition + ((e.target.id === 'transPlus') ? +1 : -1)});
  }

  onChangeFontSize(e) {
    this.setState({sFontSize: this.state.sFontSize + ((e.target.id === 'fontPlus') ? +1 : -1)});
  }

  onForceBChange(e) {
    this.setState({sForce_b: e.target.checked});
  }
}

// -----------------------------------------------------------------------------------
// Zobrazovac cele pisnicky
//
export class SongDisplayer extends React.Component {
  static propTypes = {
    content: React.PropTypes.object,
    trans: React.PropTypes.number,
    forceB: React.PropTypes.bool,
    fontSize: React.PropTypes.number
  };

  render() {
    let mTextBaseHeight = (1.7 + (this.props.fontSize * 0.2)) + 'vw';

    let mSongName = 'Název neznámý';
    if (this.props.content.songName !== '') {
      mSongName = this.props.content.songName;
    }
    let mAuthor = 'Autor neznámý';
    if (this.props.content.author !== '') {
      mAuthor = this.props.content.author;
    }
    return (
      <div>
        <SongHeader songName={mSongName} author={mAuthor} txtBaseHeight={mTextBaseHeight}></SongHeader>

        {this.props.content.data.map((item, itemId) => {

          switch (item.type) {
            case ElementType.dttStroke:
            case ElementType.dttRefrain:
            case ElementType.dttSolo:
            case ElementType.dttNote:
            case ElementType.dttNoteRight:
            case ElementType.dttRegister:
              return (
                <SongLine key={shortid.generate(10)+itemId} dataItem={item} trans={this.props.trans} forceB={this.props.forceB}
                          txtHeight={mTextBaseHeight}>
                  {item.data}
                </SongLine>
              );
              break;
          }
        })
        }
      </div>
    );
  }
}


//* -----------------------------------------------------------------------------------
// renders the song's header
//
export class SongHeader extends React.Component {
  static propTypes = {
    songName: React.PropTypes.string,
    author: React.PropTypes.string,
    txtBaseHeight: React.PropTypes.string
  };
  render() {
    let mFontSize1 = MultiplyUnits(this.props.txtBaseHeight, 1.3);
    let mFontSize2 = MultiplyUnits(this.props.txtBaseHeight, 0.6);
    return(
      <div className="SongHeader">
        <div style={{fontSize:mFontSize1, textAlign:'center'}}>
          {this.props.songName}
        </div>
        <div style={{fontSize:mFontSize2, textAlign:'center'}}>
          {this.props.author}
        </div>
      </div>
    )
  }
}

/**
 * Multiplicates the input unit by given multiplicator
 * @param (string) ATextHeight - string with unit (number + unit px/em/vh/vw)
 * @param (number) AMultiplicator - multiplication number
 * @returns {string} - same unit with multiplicated number
 */
export function MultiplyUnits(ATextHeight, AMultiplicator) {
  let mPos = ATextHeight.indexOf('px');
  if (mPos < 0) mPos = ATextHeight.indexOf('em');
  if (mPos < 0) mPos = ATextHeight.indexOf('vh');
  if (mPos < 0) mPos = ATextHeight.indexOf('vw');
  if (mPos >=0) {
    let mResult = parseFloat(ATextHeight.substr(0, mPos)) * AMultiplicator;
    return mResult.toString() + ATextHeight.substr(mPos, ATextHeight.length - mPos);
  } else
    return '2vw';
}


//* -----------------------------------------------------------------------------------
export class SongLine extends React.Component {
  static propTypes = {
    txtHeight: React.PropTypes.string,
    dataItem: React.PropTypes.object,
    trans: React.PropTypes.number,
    forceB: React.PropTypes.bool
  };

  /**
   * Converts song line of row data into segments with chords and pure text
   * @param {string} aInText - line of row song text
   * @returns {string[]} - array of separated chunks
   */
  static separateSegments(aInText) {
    let mSgmnts = [];
    let mPos;
    let mPos2;
    let mText = aInText;
    let mChord;
    // replace multiple spaces
    mText = mText.replace(/ /g, '\xA0'); // \xA0 = nbsp
    // separate
    while (mText !== '') {
      mPos = mText.indexOf('{');
      if (mPos !== 0) {
          // just text, no chord
          if (mPos > 0) {
            mSgmnts.push({chord: '', text: mText.substr(0, mPos)});
            mText = mText.substr(mPos, mText.length);
          } else {
            mSgmnts.push({chord: '', text: mText});
            mText = '';
          }
      } else {
        // mText starting with chord
        mPos2 = mText.indexOf('}');
        if (mPos2 >= 0) {
          // chord
          mChord = mText.substr(mPos + 1, mPos2 - mPos - 1) + '\xA0';
          mText = mText.substr(mPos2 + 1, mText.length - mPos2);
          mPos = mText.indexOf('{');
          if (mPos !== 0) {
            if (mPos > 0) {
              mSgmnts.push({chord: mChord, text: mText.substr(0, mPos)});
              mText = mText.substr(mPos, mText.length);
            } else {
              mSgmnts.push({chord: mChord, text: mText});
              mText = '';
            }
          } else {
            // just chord, no text
            mSgmnts.push({chord: mChord, text: ''});
          }
        } else {
          // missing closing bracket
          mText = mText.substr(mPos + 1, mText.length - mPos);
        }
      }
    }
    return mSgmnts;
  }

  render() {
    let mSegments = SongLine.separateSegments(this.props.children);
    let mTextHeight = this.props.txtHeight;
    let mRowHeight = MultiplyUnits(mTextHeight, 2.2);
    let mPrefix = this.props.dataItem.prefix + '\xA0';  // \xA0 = nbsp
    let mSpaceBlock = 'none';
    if (((this.props.dataItem.type === ElementType.dttStroke)||(this.props.dataItem.type === ElementType.dttRefrain)) &&
         (this.props.dataItem.index===0))
      mSpaceBlock = 'default';
    // define styles for elements
    let mChordStyle = {fontSize: mTextHeight, height: mTextHeight};
    let mTextStyle = {fontSize:mTextHeight};
    let mDispPrefix = 'default';
    let mPrefixStyle1 = {height: mTextHeight,fontSize:mTextHeight};
    let mPrefixStyle2 = mPrefixStyle1;
    let mOneLineStyle = {height: mRowHeight, display:'inline-flex', flexDirection:'row'};
    switch (this.props.dataItem.type) {
      case ElementType.dttStroke:
      case ElementType.dttRefrain:
        if ((this.props.children.trim() === '') || (this.props.children.indexOf('{') < 0)) {
          mOneLineStyle = Object.assign(mOneLineStyle, {height: MultiplyUnits(mRowHeight, 0.5)});
          mPrefixStyle1 = Object.assign(mPrefixStyle1, {display:'none'});
        }
        break;
      case ElementType.dttNote:
      case ElementType.dttNoteRight:
        mOneLineStyle = Object.assign(mOneLineStyle, {height: MultiplyUnits(mRowHeight, 0.5)});
        mTextStyle = Object.assign(mTextStyle, {color:'blue', fontStyle:'italic'});
        mDispPrefix = 'none';
        mPrefixStyle1 = {display:'none'};
        mPrefixStyle2 = {height: mTextHeight,fontSize:mTextHeight, color:'blue'};
        if (this.props.dataItem.type === ElementType.dttNoteRight)
          mOneLineStyle = {height: MultiplyUnits(mRowHeight, 0.5), textAlign:'right'}; // obyc div ne flex
        break;
      case ElementType.dttSolo:
        mOneLineStyle = Object.assign(mOneLineStyle, {height: MultiplyUnits(mRowHeight, 0.5)});
        mPrefixStyle1 = {display:'none'};
        break;
      case ElementType.dttRegister:
        mOneLineStyle = Object.assign(mOneLineStyle, {height: MultiplyUnits(mRowHeight, 0.5)});
        mDispPrefix = 'none';
        break;
    }
    //
    return(
      <div className="MainContainer">
        {/* odsazeni odstavce pred prvnim radkem sloky, refrenu,... */}
        <div key={shortid.generate()} style={{display: mSpaceBlock, height:'1.5vw'}}>
          {'\xA0'}
        </div>
        {/* vykresleni jednoho celeho radku */}
        <div key={shortid.generate()} className="OneLine" style={mOneLineStyle}>
          {/* leve odsazeni se zobrazenim prefixu radku */}
          <span key={shortid.generate()} className="prefixBlock" style={{display: mDispPrefix}}>
            <span key={shortid.generate()} style={mPrefixStyle1}>
              {'\xA0'}
            </span>
            <span key={shortid.generate()} style={mPrefixStyle2}>
              {mPrefix}
            </span>
          </span>
          {/* vykresleni samotneho textu s akordy */}
          { mSegments.map( (item, itemId) => {
            switch (this.props.dataItem.type) {
              case ElementType.dttStroke:
              case ElementType.dttRefrain:
                return (
                  <span key={shortid.generate()} className="TextSegment">
                    {/* render a chord */}
                    <span key={shortid.generate()} className="Chord" style={mChordStyle}>
                      {ChordTransposer.doTransposition(item.chord, this.props.trans, this.props.forceB)}
                    </span>
                    {/* render a text */}
                    <span key={shortid.generate()} className="SngText" style={mTextStyle}>
                      {item.text}
                    </span>
                  </span>
                )
              case ElementType.dttSolo:
                return (
                  <span key={shortid.generate()} className="TextSegment">
                    <span key={shortid.generate()} className="Chord" style={mChordStyle}>
                      {ChordTransposer.doTransposition(item.chord, this.props.trans, this.props.forceB) + item.text}
                    </span>
                  </span>
                )
              case ElementType.dttNote:
              case ElementType.dttNoteRight:
                return (
                  <span key={shortid.generate()} className="TextSegment">
                    <span key={shortid.generate()} style={mTextStyle}>
                      {ChordTransposer.doTransposition(item.chord, this.props.trans, this.props.forceB) + item.text}
                    </span>
                  </span>
                )
              case ElementType.dttRegister:
                return (
                  <div key={shortid.generate()} className="Register" style={mTextStyle}>
                    {item.text}
                  </div>
                )
            }
          })}
        </div>
      </div>
    )
  }

}

//* -----------------------------------------------------------------------------------




