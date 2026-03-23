import { Composition } from 'remotion';
import { GasTownVideo } from './GasTownVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GasTownVideo"
        component={GasTownVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
