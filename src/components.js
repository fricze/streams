define(["store", "react"], function(store, React){

  var exports = {};

  var MountForm = {
    getInitialState: function () {
      return {
        date: this.props.date
      }
    },
    componentDidMount: function () {
      this.props.doFocus.call(this)
    },
    onBlur: function () { 
      this.state.text ? this.props.blur(this.state.text, this.state.date) : 0
    },
    handleChange: function(event) {
      this.setState({
        text: event.target.value,
        date: new Date()
      })
    }
  }

  var BoxName = {}

  BoxName.Form = React.createClass({
    mixins: [MountForm],
    getInitialState: function () {
      return {
        text: this.props.text
      }
    },
    onFocus: function () {
      var area = this.getDOMNode();
      area.selectionStart = area.selectionEnd = area.value.length
    },
    render: function () {
      return React.DOM.input({className: "box-name-form", type: "text", placeholder: "title", value: this.state.text, onChange: this.handleChange, onBlur: this.onBlur, onFocus: this.onFocus})
    }
  })

  BoxName.Text = React.createClass({
    render: function () {
      return React.DOM.h1({className: "box-name", tabIndex: 0, onClick: this.props.click, onFocus: this.props.click}, this.props.text)
    }
  })

  var BoxContent = {}

  BoxContent.Form = React.createClass({
    mixins: [MountForm],    
    getInitialState: function () {
      return {
        text: this.props.text
      }
    },
    adjustSize: function () {
      var area = this.getDOMNode();
      area.style.height = "1px";
      area.style.height = 26+area.scrollHeight+"px";
    },
    componentDidMount: function () {
      this.adjustSize();
    },
    onFocus: function () {
      this.adjustSize();
      var area = this.getDOMNode();
      area.selectionStart = area.selectionEnd = area.value.length
    },
    render: function () {
      return React.DOM.textarea({className: "box-content-form",value: this.state.text, placeholder: "content…", onChange: this.handleChange, onKeyUp: this.adjustSize, onFocus: this.onFocus, onBlur: this.onBlur})
    }
  })

  BoxContent.Text = React.createClass({
    render: function () {
      return React.DOM.section({
        tabIndex: 0, className: "box-content", onClick: this.props.click, onFocus: this.props.click, /*onMouseEnter: this.props.click*/
      }, this.props.text)
    }
  })

  var BoxDate = React.createClass({
    render: function () {
      return React.DOM.time({className: "box-date"}, this.props.date.toLocaleDateString(), this.props.date.toLocaleTimeString())
    }
  })

  var Box = React.createClass({
    getInitialState: function () {
      return {
        nameState: "Form",
        contentState: "Form",
        nameFocus: function () { this.getDOMNode().focus() },
        contentFocus: function () {},
        date: this.props.date,
        name: this.props.name,
        content: this.props.content
      }
    },
    blur: function (keyword, val, time) {
      var state = {};
      state[keyword + "State"] = "Text";
      state[keyword] = val;
      state["date"] = time;
      this.setState(state)
    },
    click: function (keyword) {
      var state = {};
      state[keyword + "State"] = "Form";
      state[keyword + "Focus"] = function () { this.getDOMNode().focus() };
      this.setState(state)
    },
    render: function () {
      var name = BoxName[this.state.nameState]({
        text: this.state.name,
        doFocus: this.state.nameFocus,
        date: this.state.date,
        blur: (function (val, time) { this.blur("name", val, time) }).bind(this),
        click: (function () { this.click("name") }).bind(this)
      })

      var content = BoxContent[this.state.contentState]({
        text: this.state.content,
        doFocus: this.state.contentFocus,
        date: this.state.date,
        blur: (function (val, time) { this.blur("content", val, time) }).bind(this),
        click: (function () { this.click("content") }).bind(this)
      })

      return React.DOM.article({className: "box"}, name, BoxDate({date: this.state.date}), content)
    }
  })

  var NewBoxButton = React.createClass({
    render: function () {
      return React.DOM.button({className: "new-box-button", onClick: this.props.click}, "+")
    }
  })

  var SaveButton = React.createClass({
    render: function () {
      return React.DOM.button({className: "save-button", onClick: this.props.click}, "save")
    }
  })

  var StreamNav = React.createClass({
    render: function () {
      return React.DOM.nav({className: "stream-nav"},
        this.props.newBoxButton,
        this.props.saveButton
      )
    }
  })


  var LastEditLabel = React.createClass({
    render: function () {
      return React.DOM.span({className: "last-edit"}, "last edit:")
    }
  })

  var Stream = React.createClass({
    getDefaultProps: function () {
      return {
        boxes: store.get("lastSnapshot").map(function (box) {
          return Box({
            date: new Date(box.date),
            name: box.name,
            content: box.content
          })
        })
      }
    },
    newBox: function () {
      var date = new Date();
      var box = Box({date: date});
      this.props.boxes.push(box);
      this.setProps({
        boxes: this.props.boxes
      })
    },
    saveSnapshot: function () {
      var boxes = this.props.boxes;
      var snapshot = [];
      boxes.forEach(function (box) {
        var boxState = box.state;
        snapshot.push({
          name: boxState.name,
          content: boxState.content,
          date: boxState.date.toString()
        })
      })
      store.set("lastSnapshot", snapshot);
      console.log(store.get("lastSnapshot"))
    },
    render: function () {
      var boxes = this.props.boxes;
      return React.DOM.section(
        {className: "stream", onDoubleClick: this.newBox}, 
        LastEditLabel({}),
        boxes,
        StreamNav({
          saveButton: SaveButton({click: this.saveSnapshot}),
          newBoxButton: NewBoxButton({click: (function () { this.newBox() }).bind(this)})
        })
      )
    }
  })

  exports.Box = Box;
  exports.Stream = Stream;

  return exports

})