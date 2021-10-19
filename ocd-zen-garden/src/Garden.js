import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useToggle from './hooks/useToggle';
import Header from './Header';
import Modal from './Modal';
import useCurrentWidth from './hooks/useCurrentWidth';
import useCurrentHeight from './hooks/useCurrentHeight';
import { palettes } from './utils';
import Snake from './Snake';
import Dots from './Dots';
import BullsEye from './BullsEye';
import Message from './Message';
import Dominoes from './Dominoes';
import Barcode from './Barcode';
import Squares from './Squares';
import Triangles from './Triangles';
import Antlers from './Antlers';
import Pogs from './Pogs';
import Message2 from './Message2';
import Smudges from './Smudges';
import Holes from './Holes';
import Edges from './Edges';
import Crosshair from './Crosshair';
import Tallies from './Tallies';
import Cards from './Cards';
import Desk from './Desk';
import Meters from './Meters'
import Eyes from './Eyes';
import Opaque from './Opaque';
import Diamonds from './Diamonds';
import Rainbow from './Rainbow';
import './Garden.css';
import Asterisk from './Asterisk';


function Garden(props) {
    // let width = useCurrentWidth();
    // const palette = useSelector((state) => state.palette.palette);
    const height = useCurrentHeight();
    const width = useSelector((state) => state.width.appWidth);
    const fullView = useSelector((state) => state.fullView.fullView);
    const volume = useSelector((state) => state.volume.volume);
    const [colorPalette, setColorPalette] = useState(palettes[0]);
    // const [volume, setVolume] = useState(65);
    const [numRings, setNumRings] = useState(10)
    const [bullsEyeShape, setBullsEyeShape] = useState('circle')
    const [hideModal, toggleHideModal] = useToggle(false);
    const [modalContent, setModalContent] = useState('epilepsy-warning');
    const [organizationCount, setOrganizationCount] = useState(0);
    // const [resetTimer, toggleResetTimer] = useToggle(true);

    // const firstButtonCountUpdate = useRef(true);
    // useEffect(() => {
    //     console.log('we may have a problem here')
    //     if(resetTimer) {
    //         console.log('or maybe not')
    //         toggleResetTimer();
    //         setTimeout(() => {
    //             toggleResetTimer();
    //             setOrganizationCount(0);
    //         }, 1800000)
    //     }
    // }, [resetTimer], firstButtonCountUpdate);

    // useEffect(() => {
    //     if (organizationCount > 30){
    //         alert('user may actually have OCD');
    //     }
    // }, [organizationCount])


    const handleChangePalette = palette => {
        setColorPalette(palette);
    }
    
    const handleSetNumRings = num => {
        setNumRings(Number(num))
    }
    
    const handleSetShape = shape => {
        setBullsEyeShape(shape)
    }

    const handleSetModalContent = content => {
        setModalContent(content);
        toggleHideModal();
    }

    const displayFullSize = gardenPiece => {
        let gardenPieceWidth = width > height ? height - 47 : width - 2;

        switch(gardenPiece) {
            case 'snake':
                return <Snake width={gardenPieceWidth} className="Snake" />
            case 'dots':
                return <Dots width={gardenPieceWidth} className="Dots" />
            case 'bullseye':
                return <BullsEye width={gardenPieceWidth} id={1} setNumRings={handleSetNumRings} numRings={numRings} setShape={handleSetShape} shape={bullsEyeShape} sound="Whoop" className="BullsEye" orgIndex={numRings + 1} />
            case 'message':
                return <Message width={gardenPieceWidth} className="Message"/>
            case 'dominoes':
                return <Dominoes width={gardenPieceWidth} className="Dominoes" />
            case 'barcode': 
                return <Barcode width={gardenPieceWidth} className="Barcode"/>
            case 'squares':
                return <Squares width={gardenPieceWidth} className="Squares" />
            case 'triangles':
                return <Triangles width={gardenPieceWidth} className="Triangles" />
            case 'antlers':
                return <Antlers width={gardenPieceWidth} className="Antlers"/>
            case 'pogs':
                return <Pogs width={gardenPieceWidth} className="Coins"/>
            case 'message2':
                return <Message2 width={gardenPieceWidth} className="Message2"/>
            case 'smudges':
                return <Smudges width={gardenPieceWidth} className="Smudges"/>
            case 'holes':
                return <Holes width={gardenPieceWidth} className="Holes"/>
            case 'edges':
                return <Edges width={gardenPieceWidth} className="Edges"/>
            case 'crosshair':
                return <Crosshair width={gardenPieceWidth} className="Crosshair"/>
            case 'tallies':
                return <Tallies width={gardenPieceWidth} className="Tallies"/>
            case 'cards':
                return <Cards width={gardenPieceWidth} className="Cards"/>
            case 'desk':
                return <Desk width={gardenPieceWidth} className="Desk"/>
            case 'meters':
                return <Meters width={gardenPieceWidth} className="Meters"/>
            case 'eyes':
                return <Eyes width={gardenPieceWidth} className="Eyes"/>
            case 'opaque':
                return <Opaque width={gardenPieceWidth} className="Opaque"/>
            case 'diamonds':
                return <Diamonds width={gardenPieceWidth} className="Diamonds"/>
            case 'rainbow':
                return <Rainbow width={gardenPieceWidth} className="Rainbow"/>
            case 'asterisk':
                return <Asterisk width={gardenPieceWidth} className="Asterisk"/>
        }
    }


    if(!fullView) {
        let gardenPieceWidth;
        if(width >= 1000) {
            gardenPieceWidth = width / 3;
        } else if (width < 1000 && width > 600) {
            gardenPieceWidth = width / 2;
        } else {
            gardenPieceWidth = width;
        }

        return (
            <>
            <Header changePalette={handleChangePalette} setModalContent={handleSetModalContent} disableDropdowns={!hideModal} />
            <div className="Garden">
                <Snake width={gardenPieceWidth} className="Snake" setModalContent={handleSetModalContent} />
                <Dots width={gardenPieceWidth} className="Dots" setModalContent={handleSetModalContent} />
                <BullsEye width={gardenPieceWidth} id={1} setNumRings={handleSetNumRings} numRings={numRings} setShape={handleSetShape} shape={bullsEyeShape} sound="Whoop" className="BullsEye" orgIndex={numRings + 1} setModalContent={handleSetModalContent} />
                <Message width={gardenPieceWidth} className="Message" setModalContent={handleSetModalContent} />
                <Dominoes width={gardenPieceWidth} className="Dominoes"  setModalContent={handleSetModalContent} />
                <Barcode width={gardenPieceWidth} className="Barcode" setModalContent={handleSetModalContent} />
                <Squares width={gardenPieceWidth} className="Squares"  setModalContent={handleSetModalContent} />
                <Triangles width={gardenPieceWidth} className="Triangles"  setModalContent={handleSetModalContent} />
                <Antlers width={gardenPieceWidth} className="Antlers" setModalContent={handleSetModalContent} />
                <Pogs width={gardenPieceWidth} className="Coins" setModalContent={handleSetModalContent} />
                <Message2 width={gardenPieceWidth} className="Message2" setModalContent={handleSetModalContent} />
                <Smudges width={gardenPieceWidth} className="Smudges" setModalContent={handleSetModalContent} />
                <Holes width={gardenPieceWidth} className="Holes" setModalContent={handleSetModalContent} />
                <Edges width={gardenPieceWidth} className="Edges" setModalContent={handleSetModalContent} />
                <Crosshair width={gardenPieceWidth} className="Crosshair" setModalContent={handleSetModalContent} />
                <Tallies width={gardenPieceWidth} className="Tallies" setModalContent={handleSetModalContent} />
                <Cards width={gardenPieceWidth} className="Cards" setModalContent={handleSetModalContent} />
                <Desk width={gardenPieceWidth} className="Desk" setModalContent={handleSetModalContent} />
                <Meters width={gardenPieceWidth} className="Meters" setModalContent={handleSetModalContent} />
                <Eyes width={gardenPieceWidth} className="Eyes" setModalContent={handleSetModalContent} />
                <Opaque width={gardenPieceWidth} className="Opaque" setModalContent={handleSetModalContent} />
                <Diamonds width={gardenPieceWidth} className="Diamonds" setModalContent={handleSetModalContent} />
                <Rainbow width={gardenPieceWidth} className="Rainbow" setModalContent={handleSetModalContent} />
                <Asterisk width={gardenPieceWidth} className="Asterisk" setModalContent={handleSetModalContent} />
                {!hideModal ? 
                    <Modal content={modalContent} height={height} toggleHideModal={toggleHideModal} hidden={hideModal}>
                    </Modal> 
                    : null
                }
            </div>
            </>
        )
    } else {
        return (
            <div style={{width: '100vw', height: `${height}px`}}>
                <div style={{position: 'fixed', zIndex: '3'}}>
                <Header toggleLoggedIn={props.toggleLoggedIn} changePalette={handleChangePalette} setModalContent={handleSetModalContent} />
                </div>
            
                <div className="pieceContainer" style={{display: 'grid', height: `${height - 45}px`, width: '100%', gridTemplateRows: `${width <= height - 45 ? `auto ${width}px auto` : '1fr'}`, gridTemplateColumns: `${width > height - 45 ? `auto ${height - 45}px auto` : '1fr'}`}}>
                    <div style={{backgroundColor: 'black', height: '100%', width:'auto'}}></div>
                    <div style={{backgroundColor: 'black', height: '100%', width:'auto'}}>
                        {displayFullSize(fullView)}
                    </div>
                    <div style={{backgroundColor: 'black', height: '100%', width:'auto'}}></div>
                </div>
            </div>
        )
        
    }
}

export default Garden;

