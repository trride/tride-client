import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const Spinner = ({ size, feedback, textColor }) => {
	const styles = {
		spinnerStyle: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 10
		},
		textStyle: {
			marginTop: 15,
			marginBottom: 15,
			fontSize: 25,
			marginLeft: 15,
			color: textColor || '#000'
		}
	}

	const {
		spinnerStyle,
		textStyle
	} = styles

	return (
		<View style={ spinnerStyle }>
			<ActivityIndicator
				animating
				size={ size || 'large' }
			 />
			 <Text style={ textStyle }>{ feedback }</Text>
		</View>
	)
}

export { Spinner };
