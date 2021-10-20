import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { organizingCounterActions } from './store/organizing-counter';
import useToggle from './hooks/useToggle';
import { getColor, getSound, scaler, soundPlay } from './utils';
import ControlBar from './ControlBar';
import { v4 as uuidv4 } from 'uuid';


function Snake() {
    const palette = useSelector((state) => state.palette.palette);
    const width = useSelector((state) => state.size.pieceWidth);
    const volume = useSelector((state) => state.volume.volume);
    const fullView = useSelector((state) => state.size.fullView);
    const [isOrganized, toggleIsOrganized] = useToggle(false);
    const [isOrganizing, toggleIsOrganizing] = useToggle(false);
    const [nextIndex, setNextIndex] = useState(0);
    const [colorPalette, setColorPalette] = useState(palette);
    const [speed, setSpeed] = useState(1000);
    const [sound, setSound] = useState(getSound('Slam'));
    const [proportionalVolume, setProportionalVolume] = useState('proportional');
    const [numBoxes, setNumBoxes] = useState(7);
    const [numSnakes, setNumSnakes] = useState(1);
    const [shape, setShape] = useState('square');
    const dispatch = useDispatch();

    const createStartingBoxArray = num => {
        let boxes = [];
        for(let i = 1; i <= num; i++) {
            let random = Math.random() * .45 * 100
            boxes.push({
                id: i,
                left: `${Math.random() * .40 + .05}` * (Math.random() > .5 ? 1 : -1),
                color: getColor(i, colorPalette),
                key: uuidv4(),
            });
        }
        //look at squishing volume progressively less as the sitewide volume goes down
        for(let j = 0; j < boxes.length - 1; j++) {
            boxes[j].volumeMultiplier = scaler(0, .9, .0035, .01, Math.abs(boxes[j + 1].left - boxes[j].left))

        }
        boxes[boxes.length - 1].volumeMultiplier = scaler(0, .9, .0035, .01, Math.abs(boxes[boxes.length - 1].left))

        return boxes;
    }

    const [boxes, setBoxes] = useState(createStartingBoxArray(numBoxes));

    // const soundPlay = (soundObj, volumeMultiplier) => {
    //     const sound = new Howl({
    //         src: soundObj.src,
    //         sprite: soundObj.sprite,
    //         volume: props.volume * .01 * volumeMultiplier
    //     });
    //     sound.play(soundObj.spriteName);
    // }

    const firstUpdate = useRef(true);
    useEffect(()=>{
        if(!firstUpdate.current) {
            if(nextIndex < boxes.length){
                setTimeout(()=>{
                    organizeBoxes(nextIndex);
                }, speed);
            }
        } else {
            firstUpdate.current = false;
        }     
    }, [nextIndex]);

    const colorFirstUpdate = useRef(true);
    useEffect(() => {
        if(!colorFirstUpdate.current) {
            let newBoxes = boxes.map(box => {
                return {...box, color: getColor(box.id, palette)}
            });
            setColorPalette(palette);
            setBoxes(newBoxes);
            colorsDoNotUpdate.current = true;
        } else {
            colorFirstUpdate.current = false;
        }
    }, [palette]);

    const colorsDoNotUpdate = useRef(true)
    useEffect(() => {
        if(!colorsDoNotUpdate.current) {
            let newBoxes = boxes.map(box => {
                return {...box, color: getColor(box.id, colorPalette)}
            });
            setBoxes(newBoxes);
        } else {
            colorsDoNotUpdate.current = false;
        }
        
    }, [colorPalette]);


    const organizeBoxes = (idx) => {
        if(idx === 0) {
            toggleIsOrganizing();
            dispatch(organizingCounterActions.incrementOrganizingCounter())
        }
        let newBoxes;
        if(idx + 1 === boxes.length){
            newBoxes = boxes.map(box => {
                return {...box, left: 0} 
            });
        } else {
            newBoxes = boxes.map(box => {
                if(box.id <= boxes[idx].id){
                    return {...box, left: `${boxes[idx+1].left}`}
                } else {
                    return box
                }
            });
        }

        soundPlay(sound, boxes[idx].volumeMultiplier, volume, proportionalVolume);

        
        setBoxes(newBoxes);
        if(idx < boxes.length - 1) {
            setNextIndex(idx + 1);
        } else {
            dispatch(organizingCounterActions.decrementOrganizingCounter());
            setTimeout(() => {
                toggleIsOrganized();
                toggleIsOrganizing();
            }, speed);
        }
    }

    const scatterBoxes = () => {
        let newBoxes = boxes.map(box => {
            return {...box, left: `${Math.random() * .40 + .05}` * (Math.random() > .5 ? 1 : -1)};
        })
        for(let j = 0; j < boxes.length - 1; j++) {
            boxes[j].volumeMultiplier = scaler(0, .9, .35, 1, Math.abs(boxes[j + 1].left - boxes[j].left))

        }
        boxes[boxes.length - 1].volumeMultiplier = scaler(0, .9, .35, 1, Math.abs(boxes[boxes.length - 1].left))
        setBoxes(newBoxes);
        toggleIsOrganized();
    }

    const handleSetSpeed = time => {
        setSpeed(time);
    }

    const handleSetSound = sound => {
        setSound(getSound(sound));
    }

    const handleSetColorPalette = palette => {
        colorsDoNotUpdate.current = false;
        setColorPalette(palette);
    }

    const handleChangeProportionalVolume = selection => {
        setProportionalVolume(selection);
    }

    const handleSetNumBoxes = num => {
        setNumBoxes(Number(num));
        setBoxes(createStartingBoxArray(Number(num)))
    }

    const handleChangeShape = shape => {
        setShape(shape);
    }

    return (
        <div style={{margin: fullView ? '0 auto' : 0, width: `${width}px`, height: `${width}px`, border: '1px solid black', backgroundColor: getColor('base', colorPalette)}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%'}}>
                {/* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}> */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                    {/* <div id="test" style={{margin: '0 auto', height:`${width * .75}`, width:`${(width * 2 * .75 / numBoxes) + 2}px`}}> */}
                        {boxes.map(box => {
                            return (
                                // <div key={box.key} style={{position: 'relative', boxSizing: 'border-box', border: `1px solid ${getColor('border', colorPalette)}`, width: `${width * .75 / numBoxes}px`, height: `${width * .75 / numBoxes}px`, padding: 0, marginTop: '0', marginBottom: '0', left:`${box.left}%`, backgroundColor: `${box.color}`, borderRadius: `${shape === 'circle' ? '50%' : 0}`}}></div>
                                <div key={box.key} style={{position: 'relative', boxSizing: 'border-box', border: `1px solid ${getColor('border', colorPalette)}`, width: `${Math.floor(width * .75 / numBoxes)}px`, height: `${Math.floor(width * .75 / numBoxes)}px`, padding: 0, marginTop: '0', marginBottom: '0', left: `${box.left * width * .75 / numBoxes}px`, backgroundColor: `${box.color}`, borderRadius: `${shape === 'circle' ? '50%' : 0}`}}></div>
                            )
                        })}
                    {/* </div> */}
                </div>
                <ControlBar piece='snake' shape={shape} shapes={['circle', 'square']} changeShape={handleChangeShape} changeProportionalVolume={handleChangeProportionalVolume} proportionalVolume={proportionalVolume} palette={colorPalette} setPalette={handleSetColorPalette} minNum={4} maxNum={30} number={numBoxes} setNumber={handleSetNumBoxes} isOrganizing={isOrganizing} isOrganized={isOrganized} setSpeed={handleSetSpeed} setSound={handleSetSound} soundValue='Slam' organizedFunction={scatterBoxes} unorganizedFunction={() => organizeBoxes(0)} unorgButton='Scatter' orgButton='Organize' />
            </div>
        </div>
    )
}

export default Snake;