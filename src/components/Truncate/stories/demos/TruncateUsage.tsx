import Truncate from "localboast/components/Truncate"

const files = [
  {
    name: "Copy - my file - 03/03/2024.jpg",
    id: 1,
  },
  {
    name: "Copy - my file - 04/03/2024.jpg",
    id: 2,
  },
  {
    name: "Copy - my file - 05/03/2024.jpg",
    id: 3,
  },
]

// Display all file data with truncation happening 14 chars from the end
// i.e. include full date and extension BEFORE truncation kicks in
const SomeComponent = () => {
  return files.map(({ name, id }) => (
    <Truncate key={`files_${id}`} from="end" endOffset={14}>
      {name}
    </Truncate>
  ))
}
