import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loading from '../../components/index';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: true,
      page: 1,
    };
  }

  async componentDidMount() {
    const {stars, page} = this.state;
    const {route} = this.props;
    const {user} = route.params;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
        loading: false,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
    });
  }

  handleLoad = async () => {
    const {stars, page} = this.state;
    const {route} = this.props;
    const {user} = route.params;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: page + 1,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      page,
      loading: false,
    });
  };

  handleNavigate = repository => {
    const {navigation} = this.props;

    navigation.navigate('Repository', {repository});
  };

  render() {
    const {stars, loading} = this.state;
    const {route} = this.props;

    const {user} = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={this.handleLoad}
            ListFooterComponent={<Loading />}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape().isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default User;
