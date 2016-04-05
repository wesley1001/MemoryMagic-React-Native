'use strict';

var React = require('react-native');
var moment = require('moment');
let format = "MM月DD日 6:00"
var ButtonStore = require('../stores/ButtonStore');
var TaskActions = require('../actions/TaskActions');
var {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
	Text,
	ScrollView,
	Component,
	ActionSheetIOS,
	AsyncStorage
} = React;

var styles = StyleSheet.create({
	// resizeMode: 'cover',
	container: {
		marginTop: 10,
		marginBottom: 10,
		flexDirection: 'column',
		alignItems: 'stretch',
		flex: 1,
	},
	message: {
		fontSize: 17,
		marginTop: 30,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 10,
		color: '#555555'
	},

	title: {
		fontSize: 18,
		marginTop: 10,
		marginLeft: 15,
		marginRight: 15,
	},

	createTime: {
		color: '#555555',
		fontSize: 13,
		marginTop:4,
		marginLeft: 15,
		marginRight: 15,

	},

	normalTime: {
		fontSize: 17,
		marginTop:5,
		marginLeft: 15,
		marginRight: 15,

	},

	passTimeLabel: {
		color: '#DDDDDD',
		fontSize: 13,
		marginTop:0,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 5,
	},
	passTime: {
		color: '#DDDDDD',
		fontSize: 17,
		marginTop:0,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 15,

	},
	futureTimeLabel: {
		color: '#555555',
		fontSize: 13,
		marginTop: 0,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 5,
	},
	futureTime: {
		fontSize: 17,
		marginTop: 0,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 15,
	}
});

var BUTTONS = [
'删除',
'取消',
];
var DELETE_INDEX = 0;
var CANCEL_INDEX = 1;
var TRACE_KEY = '@AsncStorageOpenDetailTimes:key';

class Detail extends Component {

	constructor(props) {
		super(props);

		var message = '';
		this.state = {
			message: message,
		};
	}

	componentDidMount() {
		ButtonStore.addChangeListener('trash', this._onTrashButtonClicked.bind(this));
		this._loadInitialState().done();
	}

	componentWillUnmount() {
		ButtonStore.removeChangeListener('trash', this._onTrashButtonClicked);
	}
	
	async _loadInitialState() {
		console.log('load state');
		try {
			var trace = await AsyncStorage.getItem(TRACE_KEY);
			console.log('trace: ' + trace);
			if (trace === null) {
				await AsyncStorage.setItem(TRACE_KEY, '1');
				this.setState({
					message: '根据艾宾浩斯遗忘曲线规律，你将在以下时间得到复习提醒，为了达到良好的记忆效果，一定要在收到提醒的当天完成复习哦:'
				});

			} else if (trace === '1') {
				// await AsyncStorage.setItem(TRACE_KEY, '2');
				this.setState({
					message: '根据艾宾浩斯遗忘曲线规律，你将在以下时间得到复习提醒:'
				});

			}
			//  else if (trace === '2') {
			// 	this.setState({
			// 		message: '复习提醒时间:'
			// 	});
			// }

		} catch (error) {
			console.log("error: ", error);
		}
	}

	render() {
		var task = this.props.property;
		console.log("task: ", task);

		let now = moment();

		let createTime = moment(task.createTime);
		let createTime6am = createTime.startOf('day').add(6, 'hours');
		let dateAfterOneDay = moment(createTime6am).add(1, 'days');
		let dateAfterTwoDay = moment(createTime6am).add(2, 'days');
		let dateAfterOneWeek = moment(createTime6am).add(1, 'weeks');
		let dateAfterOneMonth = moment(createTime6am).add(1, 'months');

		let isNowBeforeOneDay = now.isBefore(dateAfterOneDay);
		let isNowBeforeTwoDay = now.isBefore(dateAfterTwoDay);
		let isNowBeforeOneWeek = now.isBefore(dateAfterOneWeek);
		let isNowBeforeOneMonth = now.isBefore(dateAfterOneMonth);
		return (
			<View style={styles.container}>
			<ScrollView>
			<Text style={styles.title}>{task.taskTitle}</Text>
			<Text style={ styles.createTime }>{ task.createTime }</Text>
			<Text style={styles.message}>{this.state.message}</Text>
			
			<Text style={ isNowBeforeOneDay ? styles.futureTimeLabel : styles.passTimeLabel }>一天之后:</Text>
			<Text style={ isNowBeforeOneDay ? styles.futureTime : styles.passTime }>{dateAfterOneDay.format(format)} </Text>

			<Text style={ isNowBeforeTwoDay ? styles.futureTimeLabel : styles.passTimeLabel }>两天之后:</Text>
			<Text style={ isNowBeforeTwoDay ? styles.futureTime : styles.passTime }>{dateAfterTwoDay.format(format)} </Text>
			
			<Text style={ isNowBeforeOneWeek ? styles.futureTimeLabel : styles.passTimeLabel }>一周之后:</Text>
			<Text style={ isNowBeforeOneWeek ? styles.futureTime : styles.passTime }>{dateAfterOneWeek.format(format)} </Text>
			
			<Text style={ isNowBeforeOneMonth ? styles.futureTimeLabel : styles.passTimeLabel }>一月之后:</Text>
			<Text style={ isNowBeforeOneMonth ? styles.futureTime : styles.passTime }>{dateAfterOneMonth.format(format)} </Text>

			</ScrollView>
			</View>
			);
	}

	_onTrashButtonClicked() {
		console.log('show ActionSheet');
		this.showActionSheet();
	}

	deleteTask() {
		var task = this.props.property
		TaskActions.delete(task);
		this.props.navigator.pop();
	}

	showActionSheet() {
		ActionSheetIOS.showActionSheetWithOptions({
			options: BUTTONS,
			destructiveButtonIndex: DELETE_INDEX,
			cancelButtonIndex: CANCEL_INDEX,

		},
		(buttonIndex) => {
			console.log('index: ' + buttonIndex);
			if (buttonIndex === 0) {
				this.deleteTask();
			}
		});
	}
}

module.exports = Detail;