import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injectable
} from "@angular/core";

@Injectable({ providedIn: "root" })
export class DomService {
  constructor(private appRef: ApplicationRef) {}

  appendComponentToBody<T>(componentRef: ComponentRef<T>) {
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  removeComponentFromBody<T>(componentRef: ComponentRef<T>) {
    if (!componentRef) {
      return;
    }

    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
