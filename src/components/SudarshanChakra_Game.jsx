import React, { useState } from 'react';
import './SudarshanChakra_Game.css';

const Kurukshetra = () => {
  const [stage, setStage] = useState(0); // 0: Start, 1-3: Rings Break, 4: Behead
  const [isAttacking, setIsAttacking] = useState(false);

  const triggerAttack = () => {
    if (stage >= 4 || isAttacking) return;

    setIsAttacking(true);

    // After the chakra "hits" (0.8s), update the stage and return chakra
    setTimeout(() => {
      setStage((prev) => prev + 1);
      setIsAttacking(false);
    }, 800);
  };

  return (
    <div className={`war-zone ${stage === 4 ? 'blood-sky' : ''}`}>
      {/* Background Elements */}
      <div className="ground">
        <div className="blood-puddles"></div>
      </div>
      <div className="war-smoke"></div>

      {/* Attack Button */}
      <div className="ui-layer">
        <button className="attack-btn" onClick={triggerAttack} disabled={isAttacking}>
          {stage < 3 ? "STRIKE PROTECTIVE RING" : stage === 3 ? "FINAL BLOW" : "VICTORY"}
        </button>
        <p className="status-text">Stage: {stage} / 4</p>
      </div>

      {/* SUDARSHAN CHAKRA */}
      <div className={`chakra-wrapper ${isAttacking ? 'strike-animation' : ''}`}>
        <div className="chakra-3d">
          <div className="chakra-main-disc">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="chakra-spike" style={{ '--i': i }}></div>
            ))}
            <div className="chakra-center-eye"></div>
          </div>
        </div>
      </div>

      {/* CENTER SCENE: THE MAN & RINGS */}
      <div className="battle-center">
        <div className="scene-container">
          
          {/* THE MAN */}
          <div className={`warrior ${stage === 4 ? 'is-beheaded' : ''}`}>
            <div className="head-part">
              <div className="m-hat"></div>
              <div className="m-face"></div>
            </div>
            <div className="body-part">
              <div className="m-torso"></div>
              <div className="m-feet"></div>
            </div>
          </div>

          {/* PROTECTIVE RINGS (SNAKES) */}
          <div className="rings-container">
            {stage < 1 && (
              <div className="ring-snake r-inner">
                <div className="snake-head"></div>
                <div className="snake-trail"></div>
              </div>
            )}
            {stage < 2 && (
              <div className="ring-snake r-middle">
                <div className="snake-head"></div>
                <div className="snake-trail"></div>
              </div>
            )}
            {stage < 3 && (
              <div className="ring-snake r-outer">
                <div className="snake-head"></div>
                <div className="snake-trail"></div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Kurukshetra;