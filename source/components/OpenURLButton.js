import React, {
  Linking,
  View,
  Component,
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native';
import RemoveButton from './RemoveButton';

var styles = StyleSheet.create({
  link: {
    color: '#32bec3'
  }
});
class OpenURLButton extends Component {
	
  propTypes: {
    url: React.PropTypes.string,
    customKey: React.PropTypes.string,
    onRemoveButtonPress: React.PropTypes.func
  }

  handleClick() {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  }
   _onRemoveButtonPress() {
		this.props.onRemoveButtonPress && this.props.onRemoveButtonPress(this.props.customKey);
  }

  render() {
    return (
    	<View style={{flexDirection: 'row', marginTop: 15, marginLeft: 15, marginRight: 15}}>
	      	<TouchableHighlight
	      		underlayColor='transparent'
	        	onPress={this.handleClick.bind(this)}>
  		      <View>
  		      	<Text style={styles.link}>{this.props.url}</Text>
  		      </View>
	      	</TouchableHighlight>
	      	<RemoveButton onRemoveButtonPress={this._onRemoveButtonPress.bind(this)}  />
		</View>
    );
  }

};

module.exports = OpenURLButton;