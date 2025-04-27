import React from 'react';
import { View } from 'react-native';
import Star from './Star';

interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(<Star key={i} filled={i < rating} />);
  }
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      {stars}
    </View>
  );
};

export default Rating;
