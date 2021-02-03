import { shallowMount } from "@vue/test-utils";
import Modal from "@/components/shared/Modal.vue";

describe("Modal.vue", () => {
  const headerSlot = "<div>Header</div>";
  const bodySlot = "<div>Body</div>";
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Modal, {
      scopedSlots: {
        header: headerSlot,
        body: bodySlot,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has correct content", () => {
    expect(wrapper.find("div.modal-header").html()).toContain(headerSlot);
    expect(wrapper.find("div.modal-body").html()).toContain(bodySlot);
  });

  it("handles mousedown correctly on modal-mask", async () => {
    await wrapper.find("div.modal-mask").trigger("mousedown");
    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close").length).toBe(1);
  });

  it("handles mousedown correctly on modal-wrapper", async () => {
    await wrapper.find("div.modal-wrapper").trigger("mousedown");
    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close").length).toBe(1);
  });

  it("handles mousedown correctly on modal-container", async () => {
    await wrapper.find("div.modal-container").trigger("mousedown");
    expect(wrapper.emitted("close")).toBeFalsy();
  });
});
