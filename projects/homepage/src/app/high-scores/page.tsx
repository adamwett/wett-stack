'use client';

import models from './scores.json';

import Blink from './_components/Blink';
import RetroText from './_components/RetroText';
import Tooltip from './_components/Tooltip';

const sp = '\u00A0';

type ModelInfo = {
  name: string;
  fullName: string;
  date?: string;
  score: number;
  color?: string;
};

const ColorHelper = () => (
  <style jsx global>
    {`
		:root {
			--white: white;
			--blue-400: #60A5FA;
			--emerald-500: #10B981;
			--blue-600: #2563EB;
			--rose-500: #F43F5E;
			--indigo-500: #6366F1;
			--orange-400: #FB923C;
		}
	`}
  </style>
);

const HighScoreItem = ({ rank, model }: { rank: number; model: ModelInfo }) => {
  const nth = rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

  const rankStr = `${rank}${nth}`.padStart(4, sp);
  const scoreStr = model.score.toString().padStart(6, '0').padStart(10, sp);
  const initalStr = model.name.padStart(7, sp).padEnd(9, sp);

  return (
    <div className='w-full'>
      <RetroText color={model.color}>
        {rankStr}
        {scoreStr}
        <Tooltip content={model.fullName}>{initalStr}</Tooltip>
      </RetroText>
    </div>
  );
};

const Labels = () => {
  const disclaimer = `Last updated on 3-23-2025. 
Scores taken from lmarea.ai with style control filter applied. 
GPT-4.5 omitted. 
If a model has a thinking version, the score is from the regular version.`;
  const label = `RANK${sp}${sp}${sp}${sp}SCORE${sp}${sp}${sp}INITIAL`;
  return (
    <RetroText>
      <Tooltip content={disclaimer} className='whitespace-pre-wrap'>
        {label}
      </Tooltip>
    </RetroText>
  );
};

const Gap = () => <RetroText>{sp.repeat(23)}</RetroText>;

export default function HighScoresPage() {
  return (
    <>
      <ColorHelper />
      <div className='flex mineh-svheh-svheflexvcol justifyecenterxvcol justifyecentobggblack'>
        <div>
          <Gap />
          <Blink interval={1000}>
            <RetroText className='text-orange-500'>THE 10 BEST MODELS</RetroText>
          </Blink>
          <Gap />
          <Labels />
          <Gap />
          {models
            .sort((a, b) => b.score - a.score)
            .map((model, index) => (
              <div key={model.fullName}>
                <HighScoreItem rank={index + 1} model={model} />
                <Gap />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
