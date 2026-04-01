import { useRef, useEffect } from 'react';
import './Dice.css';    

export function Dice() {
    const diceRef = useRef<HTMLDivElement>(null);

    const rollDice = () => {
        if (diceRef.current) {
            const x = Math.floor(Math.random() * 4) * 90;
            const y = Math.floor(Math.random() * 4) * 90;
            diceRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        }
    };

    useEffect(() => {
        rollDice();
    }, []);

    return (
        <div className="dice-container">
            <div
                className="dice"
                ref={diceRef}
                onMouseEnter={rollDice}
            >
                <div className="face face1">
                    <div className="grid">
                        <div></div><div></div><div></div>
                        <div></div><div className="dot"></div><div></div>
                        <div></div><div></div><div></div>
                    </div>
                </div>

                <div className="face face2">
                    <div className="grid">
                        <div className="dot"></div><div></div><div></div>
                        <div></div><div></div><div></div>
                        <div></div><div></div><div className="dot"></div>
                    </div>
                </div>

                <div className="face face3">
                    <div className="grid">
                        <div className="dot"></div><div></div><div></div>
                        <div></div><div className="dot"></div><div></div>
                        <div></div><div></div><div className="dot"></div>
                    </div>
                </div>

                <div className="face face4">
                    <div className="grid">
                        <div className="dot"></div><div></div><div className="dot"></div>
                        <div></div><div></div><div></div>
                        <div className="dot"></div><div></div><div className="dot"></div>
                    </div>
                </div>

                <div className="face face5">
                    <div className="grid">
                        <div className="dot"></div><div></div><div className="dot"></div>
                        <div></div><div className="dot"></div><div></div>
                        <div className="dot"></div><div></div><div className="dot"></div>
                    </div>
                </div>

                <div className="face face6">
                    <div className="grid">
                        <div className="dot"></div><div></div><div className="dot"></div>
                        <div className="dot"></div><div></div><div className="dot"></div>
                        <div className="dot"></div><div></div><div className="dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}