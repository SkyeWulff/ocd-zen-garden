import React, {useEffect, useRef, useState} from 'react';
import useToggle from './hooks/useToggle';
import { v4 as uuidv4 } from 'uuid';
import { getColor, getSound, scaler, soundPlay } from './utils';
import ControlBar from './ControlBar';


function Opaque(props) {
    const [isOrganized, toggleIsOrganized] = useToggle(false);
    const [isOrganizing, toggleIsOrganizing] = useToggle(false);
    const [numRows, setNumRows] = useState(9);
    const [nextIndex, setNextIndex] = useState(0);
    const [colorPalette, setColorPalette] = useState(props.palette);
    const [speed, setSpeed] = useState(1000);
    const [sound, setSound] = useState(getSound('Ding'));
    const [proportionalVolume, setProportionalVolume] = useState('proportional');

    const createStartingSquaresArray = num => {
        let squares = [];
        for(let i = 1; i < num ** 2 + 1; i++) {
            let random = .05 + Math.random() * .9;
            squares.push({
                id: i, 
                color: getColor(i, colorPalette),
                opacity: random,
                volumeMultiplier: scaler(.05, .95, .0035, .01, 1 - random),
                key: uuidv4()
            })
        }
        return squares
        
    }

    const [squares, setSquares] = useState(createStartingSquaresArray(numRows));

    const firstUpdate = useRef(true);
    useEffect(() => {
        if(!firstUpdate.current) {
            if(nextIndex < squares.length){
                setTimeout(() => {
                    sharpen(nextIndex)
                }, speed);
            } else {
                toggleIsOrganizing();
                toggleIsOrganized();
            }
        } else {firstUpdate.current = false}
    }, [nextIndex])
    
    const colorsFirstUpdate = useRef(true)
    useEffect(() => {
        if(!colorsFirstUpdate.current) {
            let newSquares = squares.map(square => {
                return {...square, color: getColor(square.id, props.palette)}
            });
            setColorPalette(props.palette);
            setSquares(newSquares);
            colorsDoNotUpdate.current = true;
        } else {
            colorsFirstUpdate.current = false;
        }
        
    }, [props.palette]);

    const colorsDoNotUpdate = useRef(true)
    useEffect(() => {
        if(!colorsDoNotUpdate.current) {
            let newSquares = squares.map(square => {
                return {...square, color: getColor(square.id, colorPalette)}
            });
            setSquares(newSquares);
        } else {
            colorsDoNotUpdate.current = false;
        }
        
    }, [colorPalette]);

    // const soundPlay = (soundObj, multiplier) => {
    //     const sound = new Howl({
    //         src: soundObj.src,
    //         sprite: soundObj.sprite,
    //         volume: props.volume * .01 * multiplier
    //     });
    //     sound.play(soundObj.spriteName);
    // }



    const sharpen = idx => {
        if(idx === 0) {
            toggleIsOrganizing();

        };
        let newSquares = squares.map(square => {
            if(square.id === squares[idx].id) {
                square.opacity = 1;
            }
            return square
        });

        
        soundPlay(sound, squares[idx].volumeMultiplier, props.volume, proportionalVolume);
        setSquares(newSquares);
        if(idx < squares.length) {
            setNextIndex(idx + 1);
        } else {
            setTimeout(() => {
                toggleIsOrganizing();
                toggleIsOrganized();
            }, speed);
        }
    };

    const fade = () => {
        let newSquares = squares.map(square => {
            let random = .05 + Math.random() * .9;
            return {
                ...square, 
                opacity: random,
                volumeMultiplier: scaler(.05, .95, .0035, .01, 1 - random)
            }
        });
        setSquares(newSquares)
        toggleIsOrganized();
    };

    const handleSetSpeed = time => {
        setSpeed(time);
    }

    const handleSetSound = sound => {
        setSound(getSound(sound));
    }
    const handleSetNumRows = num => {
        setNumRows(Number(num));
        setSquares(createStartingSquaresArray(Number(num)));
    }

    const handleSetColorPalette = palette => {
        colorsDoNotUpdate.current = false;
        setColorPalette(palette);
    }

    const handleChangeProportionalVolume = selection => {
        setProportionalVolume(selection);
    }

    const handleChangeVolume = volume => {
        props.changeVolume(volume);
    }

    const displaySquares = () => {
        let squareLines = []
        let newLine = []
        for(let k = 0; k < numRows**2; k++){
            newLine.push(squares[k]);
            if(newLine.length === numRows){
                squareLines.push(newLine);
                newLine = []
            }
        }
        return squareLines;
    }

    const handleToggleWindow = () => {
        if(props.fullWindow) {
            props.toggleWindow(null)
        } else {
            props.toggleWindow('opaque');
        }
    }

    return (
        <div style={{margin: props.fullWindow ? '0 auto' : 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: `${props.width}px`, height: `${props.width}px`, border: '1px solid black', backgroundColor: getColor('base', colorPalette)}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                    {displaySquares().map(squareLine => {
                        let lineKey = uuidv4()
                        return <div key={lineKey} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{squareLine.map(square => {
                            let squareKey = uuidv4()
                            return <div key={square.key} style={{display: 'inline-block', alignItems: 'center', justifyContent: 'center', backgroundColor:`${square.color}`, width: `${Math.floor(props.width * .70 * (1 / (numRows + 2)))}px`, height: `${Math.floor(props.width * .70 * (1 / (numRows + 2)))}px`, margin: 'none', opacity: square.opacity}}></div>
                        })}</div>
                    })}
                </div>
                <ControlBar toggleWindow={handleToggleWindow} fullWindow={props.fullWindow} disableFullWindow={props.disableFullWindow} setModalContent={props.setModalContent} changeProportionalVolume={handleChangeProportionalVolume} proportionalVolume={'proportional'} volume={props.volume} changeVolume={handleChangeVolume} palette={colorPalette} setPalette={handleSetColorPalette} minNum={3} maxNum={20} number={numRows} setNumber={handleSetNumRows} isOrganizing={isOrganizing} isOrganized={isOrganized} setSpeed={handleSetSpeed} setSound={handleSetSound} soundValue='Ding' organizedFunction={fade} unorganizedFunction={() => sharpen(0)} unorgButton='Fade' orgButton='Sharpen'/>
            </div>
        </div>
    )
}

export default Opaque;