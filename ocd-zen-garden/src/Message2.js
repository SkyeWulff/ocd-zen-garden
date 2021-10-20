import React,  {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { organizingCounterActions } from './store/organizing-counter';
import useToggle from './hooks/useToggle';
import { getColor, getSound } from './utils';
import ControlBar from './ControlBar';
import { v4 as uuidv4 } from 'uuid';
import { Howl } from 'howler';

function Message2(props){
    const width = useSelector((state) => state.size.pieceWidth);
    const palette = useSelector((state) => state.palette.palette);
    const volume = useSelector((state) => state.volume.volume);
    const [isOrganized, toggleIsOrganized] = useToggle(false);
    const [isOrganizing, toggleIsOrganizing] = useToggle(false);
    const [nextIndex, setNextIndex] = useState(1);
    const [speed, setSpeed] = useState(1000);
    const [sound, setSound] = useState(getSound('Sparkle'));
    const [colorPalette, setColorPalette] = useState(palette);
    const dispatch = useDispatch();

    const soundPlay = soundObj => {
        const sound = new Howl({
            src: soundObj.src,
            sprite: soundObj.sprite,
            volume: volume * .01,
        });
        sound.play(soundObj.spriteName);
    }


    const [message, setMessage] = useState('Plus Ultra, Go Beyond.');

    const fonts = ["='Allison', cursive", "'Architects Daughter', cursive", "'Diplomata SC', cursive", "'Indie Flower', cursive", "'Lobster', cursive", "'Ma Shan Zheng', cursive", "'Ma Shan Zheng', cursive", "'Mystery Quest', cursive", "'Nosifer', cursive", "'Vibur', cursive"]

    const getLetters = string => {
        let letters = string.split('').map((letter) => {
            return {
                letter: letter,
            }
        });
        let index = 1;
        for(let a = 0; a < letters.length; a++) {
            if(letters[a].letter !== ' ') {
                letters[a].id = index;
                letters[a].color =  getColor(index, colorPalette);
                letters[a].font = fonts[Math.floor(Math.random() * fonts.length)]
                index++;
                letters[a].key = uuidv4()
            } else {
                letters[a].id = null;
                letters[a].color = null;
                letters[a].key = uuidv4()
            }
        }
        return letters;
    }

    const [letters, setLetters] = useState(getLetters(message));

    let firstUpdate = useRef(true);
    useEffect(() => {
        if(!firstUpdate.current) {
            if(nextIndex < letters.length){
                setTimeout(() => {
                    matchLetters(nextIndex);
                }, speed);
            }
        } else {
            firstUpdate.current = false;
        }
    }, [nextIndex]);
    
    const matchLetters = (idx) => {
        if(idx === 1) {
            toggleIsOrganizing();
            dispatch(organizingCounterActions.incrementOrganizingCounter())
            while(letters[idx].font === letters[0].font) {
                idx++;
            }
        }
        let nextIdx = idx + 1;
        while(nextIdx < letters.length && (letters[nextIdx].font === letters[0].font || letters[nextIdx].letter === ' ')) {
            nextIdx++
        } 

        if(letters[nextIdx] === letters.length - 1 && letters[nextIdx].font === letters[0].font) {
            nextIdx++
        }

        let newLetters = letters.map(letter => {
            if(letter.id === letters[idx].id) {
                return {...letter, font: letters[0].font}
            } else return letter;
        });
        soundPlay(sound);
        setLetters(newLetters);

        if(nextIdx === letters.length) {
            dispatch(organizingCounterActions.decrementOrganizingCounter());
            setTimeout(() => {
                toggleIsOrganized();
                toggleIsOrganizing();
            }, speed);
        } else {
            setNextIndex(nextIdx);
        }

    }

    let colorFirstUpdate = useRef(true);
    useEffect(() => {
        if(!colorFirstUpdate.current) {
            let newLetters = letters.map(letter => {
                return {...letter, color: getColor(letter.id, palette)}
            });
            setLetters(newLetters);
            setColorPalette(palette);
            colorsDoNotUpdate.current = true;
        } else {
            colorFirstUpdate.current = false;
        }
    }, [palette]);

    const colorsDoNotUpdate = useRef(true)
    useEffect(() => {
        if(!colorsDoNotUpdate.current) {
            let newLetters = letters.map(letter => {
                return {...letter, color: getColor(letter.id, colorPalette)}
            });
            setLetters(newLetters);
        } else {
            colorsDoNotUpdate.current = false;
        }
        
    }, [colorPalette]);

    const handleChangeText = text => {
        if(isOrganized) {
            toggleIsOrganized();
        };
        setMessage(text);
        setLetters(getLetters(text));
    }

    const randomizeLetters = () => {
        let newLetters = letters.map(letter => {
            return {...letter, font:fonts[Math.floor(Math.random() * fonts.length)]};
        });
        setLetters(newLetters);
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

    const displayWords = letterArr => {
        let fontSize;
        if(letterArr.length > 25) {
            fontSize = width * .035
        } else {
            fontSize = width * .06
        }

        let words = [];
        let start = 0;
        for(let a = 0; a < letterArr.length; a++) {
            if(letterArr[a].letter !== ' ') {

                if(a === letterArr.length - 1) {
                    words.push(letterArr.slice(start, a + 1));
                }
            } else {
                words.push(letterArr.slice(start, a + 1));
                start = a + 1;
            }
        }
        return words.map(word => {
            let wordKey = uuidv4();
            return <span key={wordKey} style={{display: 'inline-block'}}>
                {word.map(letter => {
                    return <span key={letter.key} style={{display: 'inline-block', fontWeight:'500', textShadow: `-1px 1px ${getColor('border', colorPalette)}, 1px 1px 0 ${getColor('border', colorPalette)}, 1px -1px 0 ${getColor('border', colorPalette)}, -1px -1px 0 ${getColor('border', colorPalette)}`, margin: '1rem', fontFamily: letter.font, fontSize: `${fontSize}px`, color: `${letter.color}`}}>{letter.letter}</span>
                })}
            </span>
        })
    }

    return (
        <div style={{margin: props.fullWindow ? '0 auto' : 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: `${width}px`, height: `${width}px`, border: '1px solid black', backgroundColor: getColor('base', colorPalette)}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%'}}>
                    <div style={{ width: '100%'}}>
                        {displayWords(letters)}
                    </div>
                </div>
                <ControlBar piece='message2' palette={colorPalette} setPalette={handleSetColorPalette} isOrganizing={isOrganizing} isOrganized={isOrganized} text="Enter your own text" textValue={message} soundValue='Sparkle' changeText={handleChangeText} setSpeed={handleSetSpeed} setSound={handleSetSound} organizedFunction={randomizeLetters} unorganizedFunction={() => matchLetters(1)} unorgButton='Randomize' orgButton='Match' />

            </div>
        </div>
    )
}

export default Message2;