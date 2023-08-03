export interface StepCategory{
    label: string,
    value: string,
    description: string
}


export const StepCategories : StepCategory[] = [{label: 'Run Step', value: 'run', description: 'Run a script on macOS, Linux, or Windows'},
{label: 'Run Test Step', value: 'run-tests', description: 'Run only impacted tests as part of your pipeline'},
{label: 'Background Step', value: 'background', description: 'Run a background step'},
{label: 'Harness Plugins', value: 'harness', description: 'Run Harness plugins'},
{label: 'Bitrise Plugins', value: 'bitrise', description: 'Run Bitrise plugins'},
{label: 'GitHub Actions', value: 'github-actions', description: 'Run GitHub Actions plugins'}]