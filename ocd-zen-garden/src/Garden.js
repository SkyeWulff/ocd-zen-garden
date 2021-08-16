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

    const handleChangePalette = evt => {
        setColorPalette(evt.target.value);
    }

    const handleSetNumRings = num => {
        setNumRings(num)
    }

    return(
        <div style={{backgroundColor: getColor('base', colorPalette)}} className="Garden">
            <Snake width={width} className="Snake" palette={colorPalette} />
            <Dots width={width} className="Dots" palette={colorPalette}/>
            <BullsEye width={width} id={1} setNumRings={handleSetNumRings} numRings={numRings} sound={getSound('whoop')} className="BullsEye" orgIndex={numRings + 1} palette={colorPalette}/>
            <Message width={width} className="Message" palette={colorPalette}/>
            <Dominoes width={width} className="Dominoes" palette={colorPalette} />
            <Barcode width={width} className="Barcode" palette={colorPalette}/>
            <Squares width={width} className="Squares" palette={colorPalette} />
            <Triangles width ={width} className="Triangles" palette={colorPalette} />
            <Antlers width ={width} className="Antlers" palette={colorPalette}/>
            <select onChange={handleChangePalette} value={colorPalette}>
                {palettes.map(palette => {
                    let paletteKey = uuidv4();
                    return <option key={paletteKey} value={palette}>{palette}</option>
                })}
            </select>
        </div>
    )
}

export default Garden;

