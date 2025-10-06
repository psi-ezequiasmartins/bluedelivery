import './index.css';

export default function Search(props){
  return (
    <div className="input-group">
      <input type="text" className="form-control search" placeholder={props.text} />
      <button className="btn btn-primary" type="button" id="button-addon2">Buscar</button>
    </div>
  )
}
