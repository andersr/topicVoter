Template.votesList.onCreated(function(){
  
  var instance = this;

  //Set amount to load each time 'load more' is clicked
  instance.pageIncrement = new ReactiveVar(5);

  // set default value for qty of items to display
  instance.limit         = new ReactiveVar(instance.pageIncrement.get());

  //Qty of items that have been loaded
  instance.loaded    = new ReactiveVar(0);

  instance.autorun(function(){

    //subscribe to the most recent limit
    var votesSubscription = instance.subscribe('votes', instance.limit.get());
    
    if (votesSubscription.ready()) {

      //after items have loaded, set new limit to be items loaded + pageIncrement
      // instance.limit.set(instance.loaded.get() + pageIncrement);

    } else {
      console.log("vote subscription is not ready yet");
    };
  });

  instance.votes = function(){
    return Votes.find({}, { limit: instance.limit.get() });
  }

});



Template.votesList.helpers({
  finishedLoading: function(){
    return Template.instance().finishedLoading.get();
  },
  showMore: function(){
     return Counts.get('votesCount') > Template.instance().limit.get();
  },
  noVotes:function(){
    return Counts.get('votesCount') === 0;
  },
  creatingVote:function(){
    return Session.get("newVote");
  },
  isOwner:function(){
    return this.owner === Meteor.userId();
  },
  votes: function(){
    return Template.instance().votes();

  }
});


Template.votesList.events({

  "click .show-more": function(){

  // update the limit based on the pageIncrement
  Template.instance().limit.set(Template.instance().limit.get() + Template.instance().pageIncrement.get());

  }
});

  // by default, load only up to the limit
  // set loadedQty = limit
  //   if total count > loadedQty, set showMore to true
  // on click of show more, display another showMoreIncrement
  // update loadedQty to += showMoreIncrement
