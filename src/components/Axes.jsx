import { Text } from '@react-three/drei';

const Axes = () => {
    return (
      <>
        <Text
          position={[0, -50, 1150]}
          rotation={[0, 0, 0]}
          fontSize={72}
          color="white"
        >
          Genes
        </Text>
        <Text
          position={[1100, -50, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={72}
          color="white"
        >
          Cell Lines
        </Text>
      </>
    );
  };

  export default Axes;