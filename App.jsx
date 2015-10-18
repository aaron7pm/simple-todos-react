// App component - represents the whole app
App = React.createClass({

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			hideCompleted: false
		}
	},

	// Loads items from the Tasks collection and puts them on this.data.tasks
	getMeteorData() {
		let query = {};

		if (this.state.hideCompleted) {
			query = {checked: {$ne: true}};
		}

		return {
			tasks: Tasks.find(query, {soft: {createdAt: -1}}).fetch(),
			incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
			currentUser: Meteor.user()
		};
	},

	renderTasks() {
		return this.data.tasks.map((task) => {
			return <Task key={task._id} task={task} />;
		});
	},

	handleSubmit(event) {
		event.preventDefault();

		// Find the text field via the React ref
		var textField = React.findDOMNode(this.refs.textInput);

		Tasks.insert({
			text: textField.value.trim(),
			createdAt: new Date(),            // current time
			owner: Meteor.userId(),           // _id of logged in user
			username: Meteor.user().username  // username of logged in user
		});

		// Clear form
		textField.value = "";
	},

	toggleHideCompleted() {
		this.setState({
			hideCompleted: ! this.state.hideCompleted
		});
	},

	render() {
		return (
			<div className="container">
				<header>
					<h1>Todo List ({this.data.incompleteCount})</h1>
					<label className="hide-completed">
						<input
							type="checkbox"
							readOnly={true}
							checked={this.state.hideCompleted}
							onClick={this.toggleHideCompleted} />
						Hide Completed Tasks
					</label>

					<AcccountsUIWrapper />

					{ 
						this.data.currentUser ?
						<form className="new-task" onSubmit={this.handleSubmit} >
							<input
								type="text"
								ref="textInput"
								placeholder="Type to add new tasks" />
						</form> : ''
					}
					
				</header>
				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		);
	}
});