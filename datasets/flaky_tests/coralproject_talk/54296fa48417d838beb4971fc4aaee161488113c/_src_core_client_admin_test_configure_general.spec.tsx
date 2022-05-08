// https://github.com/coralproject/talk/blob/54296fa48417d838beb4971fc4aaee161488113c/src/core/client/admin/test/configure/general.spec.tsx 

// blob: 54296fa48417d838beb4971fc4aaee161488113c 

// project_name: coralproject/talk 

// flaky_file: /src/core/client/admin/test/configure/general.spec.tsx 

// test_affected: https://github.com/coralproject/talk/blob/54296fa48417d838beb4971fc4aaee161488113c/src/core/client/admin/test/configure/general.spec.tsx 
// start_line:  69 
// end_line: 115 
it("change language", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.locale).toEqual("es");
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    context: { changeLocale },
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const languageField = within(generalContainer).getByLabelText("Language");

  // Let's change the language.
  act(() => languageField.props.onChange("es"));

  // Send form
  await act(async () => {
    await within(configureContainer)
      .getByType("form")
      .props.onSubmit();
  });

  // Submit button and text field should be disabled.
  await wait(() => {
    expect(saveChangesButton.props.disabled).toBe(true);
  });

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });

  // Wait for client to change language.
  await wait(() => {
    expect((changeLocale as SinonStub).called).toBe(true);
  });
});
