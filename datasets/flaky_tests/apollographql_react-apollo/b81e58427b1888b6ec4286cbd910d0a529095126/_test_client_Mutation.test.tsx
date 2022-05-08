// https://github.com/apollographql/react-apollo/blob/b81e58427b1888b6ec4286cbd910d0a529095126/test/client/Mutation.test.tsx 

// blob: b81e58427b1888b6ec4286cbd910d0a529095126 

// project_name: apollographql/react-apollo 

// flaky_file: /test/client/Mutation.test.tsx 

// test_affected: https://github.com/apollographql/react-apollo/blob/b81e58427b1888b6ec4286cbd910d0a529095126/test/client/Mutation.test.tsx 
// start_line:  1480 
// end_line:  1525 
it('calls the onCompleted prop after the mutation is complete', done => {
  let success = false;
  const onCompletedFn = jest.fn();
  const checker = () => {
    setTimeout(() => {
      success = true;
      expect(onCompletedFn).toHaveBeenCalledWith(data);
      done();
    }, 100);
  };

  class Component extends React.Component {
    state = {
      called: false,
    };

    render() {
      const { called } = this.state;
      if (called === true) {
        return null;
      } else {
        return (
          <Mutation mutation={mutation} onCompleted={onCompletedFn}>
            {createTodo => {
              setTimeout(() => {
                createTodo();
                this.setState({ called: true }, checker);
              });
              return null;
            }}
          </Mutation>
        );
      }
    }
  }

  mount(
    <MockedProvider mocks={mocks}>
      <Component />
    </MockedProvider>,
  );

  setTimeout(() => {
    if (!success) done.fail('timeout passed');
  }, 500);
});
