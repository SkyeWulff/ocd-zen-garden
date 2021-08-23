import React, { useState} from 'react';
import useToggle from './hooks/useToggle';
import useCurrentWidth from './hooks/useCurrentWidth';
import { getColor, palettes, getSound } from './utils';
import Snake from './Snake';
import Dots from './Dots';
import BullsEye from './BullsEye';
import Message from './Message';
import Dominoes from './Dominoes';
import Barcode from './Barcode';
import Squares from './Squares';
import Triangles from './Triangles';
import Antlers from './Antlers';
import './Garden.css';
import { v4 as uuidv4 } from 'uuid';

function Garden(){
    let width = useCurrentWidth();
    const [colorPalette, setColorPalette] = useState(palettes[0]);
    const [numRings, setNumRings] = useState(10)
    const [fullSelectedPiece, setFullSelectedPiece] = useState(null);

    const handleChangePalette = evt => {
        setColorPalette(evt.target.value);
    }

    const handleSetNumRings = num => {
        setNumRings(Number(num))
    }

    const handleToggleWindow = fullWindowPiece => {
        setFullSelectedPiece(fullWindowPiece);
    }



    const displayFullSize = gardenPiece => {
        // let gardenPieceWidth = width * .5
        let gardenPieceWidth;
        let disableFullWindow = false;
        if(width >= 900) {
            gardenPieceWidth = width * .5;
        } else if (width < 900 && width > 600) {
            gardenPieceWidth = width
        } 
        switch(gardenPiece) {
            case 'snake':
                return <Snake width={gardenPieceWidth} className="Snake" palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow} />
            case 'dots':
                return <Dots width={gardenPieceWidth} className="Dots" palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow} />
            case 'bullseye':
                return <BullsEye width={gardenPieceWidth} id={1} setNumRings={handleSetNumRings} numRings={numRings} sound="Whoop" className="BullsEye" orgIndex={numRings + 1} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow} />
            case 'message':
                return <Message width={gardenPieceWidth} className="Message" palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
            case 'dominoes':
                return <Dominoes width={gardenPieceWidth} className="Dominoes" palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
            case 'barcode': 
                return <Barcode width={gardenPieceWidth} className="Barcode" palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
            case 'squares':
                return <Squares width={gardenPieceWidth} className="Squares" palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
            case 'triangles':
                return <Triangles width={gardenPieceWidth} className="Triangles" palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
            case 'antlers':
                return <Antlers width={gardenPieceWidth} className="Antlers" palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
        }
    }

    if(!fullSelectedPiece) {
        let gardenPieceWidth;
        let disableFullWindow = false;
        if(width >= 900) {
            gardenPieceWidth = width / 3;
        } else if (width < 900 && width > 600) {
            gardenPieceWidth = width / 2;
        } else {
            gardenPieceWidth = width;
            disableFullWindow = true;
        }

        return (
            <div className="Garden">
                <Snake width={gardenPieceWidth} className="Snake" disableFullWindow={disableFullWindow} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Dots width={gardenPieceWidth} className="Dots" disableFullWindow={disableFullWindow} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <BullsEye width={gardenPieceWidth} id={1} setNumRings={handleSetNumRings} numRings={numRings} sound="Whoop" className="BullsEye" disableFullWindow={disableFullWindow} orgIndex={numRings + 1} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Message width={gardenPieceWidth} className="Message" disableFullWindow={disableFullWindow} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Dominoes width={gardenPieceWidth} className="Dominoes" disableFullWindow={disableFullWindow} palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Barcode width={gardenPieceWidth} className="Barcode" disableFullWindow={disableFullWindow} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Squares width={gardenPieceWidth} className="Squares" disableFullWindow={disableFullWindow} palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Triangles width={gardenPieceWidth} className="Triangles" disableFullWindow={disableFullWindow} palette={colorPalette}  fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <Antlers width={gardenPieceWidth} className="Antlers" disableFullWindow={disableFullWindow} palette={colorPalette} fullWindow={fullSelectedPiece} toggleWindow={handleToggleWindow}/>
                <select onChange={handleChangePalette} value={colorPalette}>
                    {palettes.map(palette => {
                        let paletteKey = uuidv4();
                        return <option key={paletteKey} value={palette}>{palette}</option>
                    })}
                </select>
            </div>
        )
    } else {
        return displayFullSize(fullSelectedPiece);
    }
}

export default Garden;

