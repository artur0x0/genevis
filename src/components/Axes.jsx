import { Text } from '@react-three/drei';

const Axes = () => {
    return (
      <>
        <Text
          position={[0, -100, 2875]}
          rotation={[0, 0, 0]}
          fontSize={144}
          color="white"
        >
          Genes
        </Text>
        <Text
          position={[2775, -100, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={144}
          color="white"
        >
          Cell Lines
        </Text>
      </>
    );
  };

  export default Axes;