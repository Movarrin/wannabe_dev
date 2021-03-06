App.Views.BotView = Backbone.View.extend({

	// el: '#container',

	initialize: function () {
		console.log('single bot view created');
		this.template = Handlebars.compile($('#bottemplate').html());
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},

	render: function () {
		this.$el.append(this.template(this.model.toJSON()));
		this.$el.attr('class', 'item');
	}

})