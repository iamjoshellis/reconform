import "babel-polyfill";
import withFields from "./hocs/withFields";
import withForm from "./hocs/withForm";

export { default as withFields } from "./hocs/withFields";
export { default as withForm } from "./hocs/withForm";

export default {
  withFields,
  withForm
};
