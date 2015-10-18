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
			const currentUserId = this.data.currentUser && this.data.currentUser._id;
			const showPrivateButton = task.owner === currentUserId;

			return <Task
				key={task._id}
				task={task} 
				showPrivateButton={showPrivateButton} />;
		});
	},

	handleSubmit(event) {
		event.preventDefault();

		// Find the text field via the React ref
		var textField = React.findDOMNode(this.refs.textInput);

		Meteor.call("addTask", textField.value.trim());

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