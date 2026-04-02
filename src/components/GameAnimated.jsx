import React from 'react';
import './GameAnimated.css';

function GameAnimated() {
    return (
        <div className="game-wrapper">
            <div className="stage">
                {/* Pixel Mario (Keep him flat while world tilts) */}
                <div className="mario-container">
                    <div className="mario">
                        <div className="hat"></div>
                        <div className="face"></div>
                        <div className="torso"></div>
                        <div className="feet"></div>
                    </div>
                </div>

                {/* Snake Rings with 3D paths */}
                <div className="snake-orbit s-inner">
                    <div className="snake-body"></div>
                </div>
                <div className="snake-orbit s-middle">
                    <div className="snake-body"></div>
                </div>
                <div className="snake-orbit s-outer">
                    <div className="snake-body"></div>
                </div>
            </div>
        </div>
    );
}

export default GameAnimated;