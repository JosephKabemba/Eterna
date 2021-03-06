import React from 'react';
import { StyleSheet, Share, View } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import { debounce } from 'lodash'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { updateContact, deleteContact } from '../actions/contactsActions'

interface Props {
  // is navigation an object?
  navigation: any
  userId: string
}
interface State {
  firstName: string,
  lastName: string,
  birthday: any,
  phone: string
  email: string
  address: string,
  id: string
}

class ProfileScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    userId = this.props.navigation.state.params.userId
  }

  state: State = {
    firstName: this.props.navigation.state.params.contact.firstName,
    lastName: this.props.navigation.state.params.contact.lastName,
    birthday: this.props.navigation.state.params.contact.birthday || new Date(),
    phone: this.props.navigation.state.params.contact.phone,
    email: this.props.navigation.state.params.contact.email,
    address: this.props.navigation.state.params.contact.address,
    id: this.props.navigation.state.params.contact.id
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
      headerRight: (
        <View>
          <Button style={{ backgroundColor: 'transparent' }} transparent onPress={ () => {
            const contactId = navigation.state.params.contact.id
            const deleteContact = navigation.getParam('deleteContact')
            deleteContact(contactId)
            navigation.navigate('Home')
            } }>
            <Text style={{color: "red"}}>Delete</Text>
          </Button>
        </View>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ 
      deleteContact: this.props.deleteContact,
    });
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleStateUpdate = debounce( () => {
    const id = this.props.navigation.state.params.contact.id
    const contact = this.state
    this.props.updateContact( contact, this.props.userId )
    
  }, 1000)

  componentDidUpdate = (prevProps, prevState) => {
    if ( prevState !== this.state ) {
      this.handleStateUpdate()
    }
  }

  getFormattedBirthday = ( date ) => {
    return moment(date).format("MMMM Do YYYY")
  }

  handleBirthdayUpdate = ( date:Date ) => {
    this.setState({ birthday: moment(date).format() })
  }

  onShare = async () => {
    try {
      const shareState = this.state
      shareState.birthday = moment(this.state.birthday).format("MMMM Do YYYY")
      const result = await Share.share({

        message: JSON.stringify(this.state),
        title: `Contact information for ${this.state.firstName} ${this.state.lastName}`
      },
      {
        dialogTitle: `Contact information for ${this.state.firstName} ${this.state.lastName}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
}

  render() {
    return (
      <KeyboardAwareScrollView extraScrollHeight={100} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
      <Form>
        <Card>
            <CardItem header>
              <Text>Name</Text>
            </CardItem>
            <CardItem>
              <Body>
                <TextInput 
                  prop="firstName"
                  label="First Name" 
                  placeholder={this.state.firstName}
                  value={this.state.firstName}
                  handleTextUpdate={this.handleTextUpdate}
                  />
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <TextInput 
                  prop="lastName"
                  label="Last Name" 
                  placeholder={this.state.lastName}
                  value={this.state.lastName}
                  handleTextUpdate={this.handleTextUpdate}
                />
              </Body>
            </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Birthday</Text>
          </CardItem>
          <CardItem>
            <Body>
              <CustomDatePicker
                handleDateChange={this.handleBirthdayUpdate}
                selectedDate={ moment(this.state.birthday, "MMMM Do YYYY").toDate() }
                formattedDate={this.getFormattedBirthday(this.state.birthday)}
              />
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Contact Information</Text>
          </CardItem>
          <CardItem>
            <Body>
              <TextInput 
                prop="email"
                label="Email" 
                placeholder={this.state.email}
                value={this.state.email}
                handleTextUpdate={this.handleTextUpdate}
                autoCorrect={false}
                keyboardType="email-address"
                autoCapitalize='none'
                textContentType="emailAddress"
              />
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <TextInput                 
                prop="phone"
                label="Phone Number" 
                placeholder={this.state.phone}
                value={this.state.phone}
                handleTextUpdate={this.handleTextUpdate}
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                />
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Address</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Textarea 
                label="Address" 
                rowSpan={3} 
                placeholder={this.state.address}
                value={this.state.address}
                onChangeText={(text) => this.handleTextUpdate(text, 'address')}
              />
            </Body>
          </CardItem>
        </Card>
        </Form>
        <Button style={styles.button} full info onPress={this.onShare}>
          <Text style={{ color: '#fff' }}>Share This Contact</Text>
        </Button>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { userId } = state
  return { userId }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateContact,
    deleteContact
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
    button: {
      backgroundColor: "#3F51B5"
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
