// https://github.com/enzymejs/enzyme/blob/b8289d02355882c57bf334ce001307807a674661/packages/enzyme-test-suite/test/shared/hooks/useEffect.jsx 

// blob: b8289d02355882c57bf334ce001307807a674661 

// project_name: enzymejs/enzyme 

// flaky_file: /packages/enzyme-test-suite/test/shared/hooks/useEffect.jsx 

// test_affected: https://github.com/enzymejs/enzyme/blob/b8289d02355882c57bf334ce001307807a674661/packages/enzyme-test-suite/test/shared/hooks/useEffect.jsx 
// start_line:  263 
// end_line: 271 
itIf.skip(is('> 16.8.3'), 'cleanup on unmount', () => {
  const wrapper = Wrap(<FriendStatus friend={friend} />);

  wrapper.unmount();

  expect(ChatAPI.unsubscribeFromFriendStatus).to.have.property('callCount', 1);
  const [[firstArg]] = ChatAPI.unsubscribeFromFriendStatus.args;
  expect(firstArg).to.equal(friend.id);
});
